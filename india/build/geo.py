"""Base geometries for the subcontinent, in longitude/latitude.

Every map of every era is cut out of the same land, so that the outline of India is always the one
recognised by the Government of India (Natural Earth, "India point of view" edition).
"""
import json
import math
from functools import lru_cache
from pathlib import Path

import numpy as np
import shapely
from shapely.geometry import shape, box, Polygon, MultiPolygon, GeometryCollection
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"

FRAME = box(59.5, 4.5, 100.5, 38.5)  # lon/lat window that is drawn

# Countries drawn as part of the subcontinent; the rest of the frame is context
SOUTH_ASIA = ["IND", "PAK", "BGD", "NPL", "BTN", "LKA", "MDV"]
CONTEXT = ["AFG", "IRN", "CHN", "MMR", "TJK", "TKM", "UZB", "KGZ", "THA", "OMN", "LAO", "IDN", "MYS"]


def polys(g):
    if g.is_empty:
        return []
    if isinstance(g, Polygon):
        return [g]
    if isinstance(g, (MultiPolygon, GeometryCollection)):
        return [p for part in g.geoms for p in polys(part)]
    return []


def clean(g):
    g = shapely.make_valid(g).buffer(0)
    ps = polys(g)
    return MultiPolygon(ps) if len(ps) != 1 else ps[0]


@lru_cache(None)
def countries():
    out = {}
    for f in json.load(open(RAW / "ne_10m_admin_0_countries_ind.geojson"))["features"]:
        p = f["properties"]
        g = shape(f["geometry"])
        if g.intersects(FRAME):
            out[p["ADM0_A3"]] = clean(g.intersection(FRAME))
    return out


def country(a3):
    return countries()[a3]


@lru_cache(None)
def admin1():
    """Indian states and union territories, plus provinces of the neighbours.

    Natural Earth's default admin-1 layer leaves out of India the areas that are under Pakistani or
    Chinese control. Here they are given back to the Indian union territories they belong to in the
    official map of India: Mirpur-Muzaffarabad to Jammu and Kashmir; Gilgit-Baltistan, Aksai Chin
    and the Shaksgam valley to Ladakh.
    """
    feats = json.load(open(RAW / "ne_10m_admin_1_states_provinces.geojson"))["features"]
    out = {}
    pak_ajk = None
    for f in feats:
        p = f["properties"]
        g = shape(f["geometry"])
        if not g.intersects(FRAME):
            continue
        key = f'{p["adm0_a3"]}:{p["name"]}'
        if key == "PAK:Azad Kashmir":
            pak_ajk = clean(g)
        out[key] = clean(g)
    ind = country("IND")
    states = {k: v.intersection(ind) for k, v in out.items() if k.startswith("IND:")}
    gap = clean(ind.difference(unary_union(list(states.values()))))
    ajk = gap.intersection(pak_ajk.buffer(0.02))
    rest = gap.difference(ajk)
    states["IND:Jammu and Kashmir"] = clean(unary_union([states["IND:Jammu and Kashmir"], ajk]))
    states["IND:Ladakh"] = clean(unary_union([states["IND:Ladakh"], rest]))
    # neighbours: cut to the country outline of the India point of view
    for k, v in out.items():
        a3 = k.split(":")[0]
        if a3 != "IND" and a3 in countries():
            g = v.intersection(country(a3))
            if not g.is_empty:
                states[k] = clean(g)
    return states


def adm(*names):
    """Union of admin-1 units: "Kerala" (India) or "PAK:Sind"."""
    A = admin1()
    gs = []
    for n in names:
        k = n if ":" in n else f"IND:{n}"
        if k not in A:
            raise KeyError(k)
        gs.append(A[k])
    return clean(unary_union(gs))


def ctry(*a3s):
    return clean(unary_union([country(a) for a in a3s]))


def bbox(lon0, lat0, lon1, lat1):
    return box(lon0, lat0, lon1, lat1)


def poly(pts, soft=0.2):
    """A hand-drawn polygon in longitude/latitude, with its corners rounded so it looks less like a ruler."""
    g = Polygon(pts)
    if soft:
        g = g.buffer(-soft, quad_segs=4).buffer(soft * 2, quad_segs=4).buffer(-soft, quad_segs=4)
    return clean(g)


def land():
    return clean(unary_union([country(a) for a in SOUTH_ASIA]))


# ---------------------------------------------------------------- projection
LON0, LAT0 = math.radians(80.0), math.radians(22.0)
R = 6371.0
SCALE = 1 / 4.2  # km -> SVG units


def laea(lon, lat):
    l, p = np.radians(lon), np.radians(lat)
    k = np.sqrt(2 / (1 + math.sin(LAT0) * np.sin(p) + math.cos(LAT0) * np.cos(p) * np.cos(l - LON0)))
    x = R * k * np.cos(p) * np.sin(l - LON0)
    y = R * k * (math.cos(LAT0) * np.sin(p) - math.sin(LAT0) * np.cos(p) * np.cos(l - LON0))
    return x * SCALE, -y * SCALE


def project(g):
    return shapely.transform(g, lambda c: np.stack(laea(c[:, 0], c[:, 1]), 1))
