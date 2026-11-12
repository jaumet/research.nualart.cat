"""Base geometries for Australia, in longitude/latitude.

Every map of every year is cut out of the same land (Natural Earth), so the coast never moves: only the
lines drawn on it do.
"""
import json
import math
from functools import lru_cache
from pathlib import Path

import numpy as np
import shapely
from shapely.geometry import shape, box, LineString, Polygon, MultiPolygon, GeometryCollection
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"

FRAME = box(109.5, -45.5, 158.5, -6.5)  # lon/lat window that is drawn

# Countries drawn around Australia, as context
CONTEXT = ["IDN", "PNG", "TLS", "SLB"]


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
    for f in json.load(open(RAW / "ne_10m_admin_0_countries.geojson"))["features"]:
        p = f["properties"]
        g = shape(f["geometry"])
        if g.intersects(FRAME):
            out[p["ADM0_A3"]] = clean(g.intersection(FRAME))
    return out


def country(a3):
    return countries()[a3]


@lru_cache(None)
def states():
    """Australian states and territories inside the frame (Lord Howe and Macquarie islands are left out)."""
    out = {}
    for f in json.load(open(RAW / "ne_10m_admin_1_states_provinces.geojson"))["features"]:
        p = f["properties"]
        if p["adm0_a3"] != "AUS":
            continue
        g = clean(shape(f["geometry"]).intersection(FRAME))
        if not g.is_empty:
            out[p["name"]] = g
    return out


def bbox(lon0, lat0, lon1, lat1):
    return box(lon0, lat0, lon1, lat1)


def west_of(lon):
    return bbox(100, -50, lon, 0)


def east_of(lon):
    return bbox(lon, -50, 170, 0)


def north_of(lat):
    return bbox(100, lat, 170, 0)


def south_of(lat):
    return bbox(100, -50, 170, lat)


def land():
    return clean(unary_union(list(states().values())))


def mainland():
    return max(polys(land()), key=lambda p: p.area)


# The straight lines of the borders, as they were written in laws and letters patent
RULER = {
    "129E": ("129° East", LineString([(129, -10), (129, -36)]),
             "1825 for New South Wales, 1829 for Western Australia. Today the border of Western Australia."),
    "138E": ("138° East", LineString([(138, -10), (138, -26)]),
             "1862: Queensland grows west to this line. Today the border between Queensland and the Northern Territory."),
    "141E": ("141° East", LineString([(141, -26), (141, -39)]),
             "1836: the eastern edge of South Australia. Today it divides South Australia from Queensland, New South Wales and Victoria."),
    "26S": ("26° South", LineString([(129, -26), (141, -26)]),
            "1836: the northern edge of South Australia. Today the border with the Northern Territory and a short piece of Queensland."),
    "29S": ("29° South", LineString([(141, -29), (152, -29)]),
            "1859: the western part of the border between New South Wales and Queensland."),
    "CAPEHOWE": ("Cape Howe line", LineString([(148.2, -36.8), (149.98, -37.5)]),
                 "A straight line from Cape Howe to the spring of the Murray River: the eastern end of the border of Victoria (1851)."),
}


# ---------------------------------------------------------------- projection
LON0, LAT0 = math.radians(134.0), math.radians(-26.0)
R = 6371.0
SCALE = 1 / 6.0  # km -> SVG units


def laea(lon, lat):
    l, p = np.radians(lon), np.radians(lat)
    k = np.sqrt(2 / (1 + math.sin(LAT0) * np.sin(p) + math.cos(LAT0) * np.cos(p) * np.cos(l - LON0)))
    x = R * k * np.cos(p) * np.sin(l - LON0)
    y = R * k * (math.cos(LAT0) * np.sin(p) - math.sin(LAT0) * np.cos(p) * np.cos(l - LON0))
    return x * SCALE, -y * SCALE


def project(g):
    return shapely.transform(g, lambda c: np.stack(laea(c[:, 0], c[:, 1]), 1))
