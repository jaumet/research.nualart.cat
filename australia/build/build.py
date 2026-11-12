#!/usr/bin/env python3
"""Build data/geo.js: every map of the atlas, projected and simplified.

    python3 build/build.py

Needs python3 with shapely >= 2.1 and numpy. Sources are in build/raw/ (see LICENSES.md); the pieces and
their timeline are in build/eras.py.
"""
import json

import numpy as np
import shapely
from shapely.geometry import Point
from shapely.ops import polylabel, unary_union

import eras
import geo
from geo import ROOT, clean, polys

OUT = ROOT.parent / "data" / "geo.js"
TOL = 0.5  # simplification, in SVG units (1 unit = 6 km)
DOT_AREA = 6.0  # pieces smaller than this (in SVG units²) also get a dot, so they can be seen and tapped

FB = geo.project(geo.FRAME).bounds
OX, OY = FB[0], FB[1]


def fmt(v):
    s = f"{v:.1f}"
    return s[:-2] if s.endswith(".0") else s


def to_path(g, min_area=0.4):
    out = []
    for p in polys(g):
        if p.area < min_area:
            continue
        for ring in [p.exterior, *p.interiors]:
            pts = list(ring.coords)[:-1]
            if len(pts) < 3:
                continue
            out.append("M" + "L".join(f"{fmt(x - OX)},{fmt(y - OY)}" for x, y in pts) + "Z")
    return "".join(out)


def lines_path(g):
    out = []
    for part in getattr(g, "geoms", [g]):
        if part.geom_type == "LineString" and len(part.coords) > 1:
            out.append("M" + "L".join(f"{fmt(x - OX)},{fmt(y - OY)}" for x, y in part.coords))
        elif hasattr(part, "geoms"):
            out.append(lines_path(part))
    return "".join(out)


def label_point(g):
    ps = polys(g)
    if not ps:
        return None
    big = max(ps, key=lambda p: p.area)
    try:
        c = polylabel(big, tolerance=0.5)
    except Exception:
        c = big.representative_point()
    return [round(c.x - OX, 1), round(c.y - OY, 1)]


def xy(lon, lat):
    x, y = geo.laea(lon, lat)
    return [round(float(x) - OX, 1), round(float(y) - OY, 1)]


def simplify_all(geoms):
    """Simplify a set of non-overlapping shapes together, so that neighbours keep sharing their border."""
    proj = [geo.project(g) for g in geoms]
    simp = shapely.coverage_simplify(np.array(proj, dtype=object), TOL, simplify_boundary=True)
    return [clean(g) for g in simp]


def build_pieces():
    P = eras.pieces()
    keys = sorted(P)
    gs = simplify_all([P[k] for k in keys])
    pieces = {}
    for k, g in zip(keys, gs):
        row = {"d": to_path(g, 0.05), "l": label_point(g), "a": round(geo.project(P[k]).area)}
        if row["a"] < DOT_AREA:
            row["dot"] = 1
            row["l"] = label_point(geo.project(P[k]))
        pieces[k] = row
    # shared borders between pieces: shown when the two pieces belong to different units
    edges = []
    for i, a in enumerate(keys):
        for b in keys[i + 1:]:
            ga, gb = gs[i], gs[keys.index(b)]
            if not ga.buffer(0.01).intersects(gb):
                continue
            line = ga.boundary.intersection(gb.boundary)
            line = shapely.line_merge(line) if line.geom_type in ("MultiLineString", "LineString") else line
            d = lines_path(line)
            if d:
                edges.append([a, b, d])
    return pieces, edges, P


def ruler():
    """The straight pieces of today's borders, and the share of all inner borders that they make up."""
    S = geo.states()
    inner = []
    names = list(S)
    for i, a in enumerate(names):
        for b in names[i + 1:]:
            if S[a].buffer(0.01).intersects(S[b]):
                inner.append(S[a].boundary.intersection(S[b].buffer(0.01)))
    inner = unary_union(inner)
    total = geo.project(inner).length  # in SVG units
    out, straight = {}, 0
    for k, (name, line, note) in geo.RULER.items():
        seg = line.buffer(0.08).intersection(inner)
        seg = shapely.line_merge(seg) if seg.geom_type == "MultiLineString" else seg
        length = geo.project(seg).length
        straight += length
        out[k] = {"n": name, "t": note, "d": lines_path(geo.project(line.intersection(geo.mainland().buffer(0.02)))),
                  "km": round(length * 6 / 10) * 10}
    return out, round(100 * straight / total), round(total * 6 / 100) * 100


# Places for "Your place through time": name, state today, lon, lat
PLACES = [
    ("Sydney", "New South Wales", 151.21, -33.87), ("Melbourne", "Victoria", 144.96, -37.81),
    ("Brisbane", "Queensland", 153.03, -27.47), ("Perth", "Western Australia", 115.86, -31.95),
    ("Adelaide", "South Australia", 138.60, -34.93), ("Hobart", "Tasmania", 147.33, -42.88),
    ("Darwin", "Northern Territory", 130.84, -12.46), ("Canberra", "Australian Capital Territory", 149.13, -35.28),
    ("Alice Springs", "Northern Territory", 133.88, -23.70), ("Cairns", "Queensland", 145.77, -16.92),
    ("Townsville", "Queensland", 146.82, -19.26), ("Broome", "Western Australia", 122.24, -17.96),
    ("Uluru", "Northern Territory", 131.04, -25.34), ("Newcastle", "New South Wales", 151.78, -32.93),
    ("Wollongong", "New South Wales", 150.89, -34.42), ("Geelong", "Victoria", 144.36, -38.15),
    ("Ballarat", "Victoria", 143.85, -37.56), ("Launceston", "Tasmania", 147.14, -41.43),
    ("Albany", "Western Australia", 117.88, -35.02), ("Broken Hill", "New South Wales", 141.47, -31.95),
    ("Mount Isa", "Queensland", 139.49, -20.73), ("Katherine", "Northern Territory", 132.26, -14.46),
    ("Tennant Creek", "Northern Territory", 134.19, -19.65), ("Coober Pedy", "South Australia", 134.76, -29.01),
    ("Port Augusta", "South Australia", 137.77, -32.49), ("Rockhampton", "Queensland", 150.51, -23.38),
    ("Thursday Island", "Queensland", 142.22, -10.58), ("Dubbo", "New South Wales", 148.60, -32.25),
    ("Gold Coast", "Queensland", 153.40, -28.02), ("Port Hedland", "Western Australia", 118.60, -20.31),
    ("Ceduna", "South Australia", 133.68, -32.13), ("Wagga Wagga", "New South Wales", 147.37, -35.12),
]


def piece_of(P, lon, lat):
    pt = Point(lon, lat)
    best = None
    for k, g in P.items():
        if g.contains(pt):
            return k
        d = g.distance(pt)
        if best is None or d < best[0]:
            best = (d, k)
    return best[1]


def main():
    data = {}
    fb = FB
    data["viewBox"] = [0, 0, round(fb[2] - fb[0]), round(fb[3] - fb[1])]
    # projection parameters, so that the page can place points given in longitude/latitude
    data["proj"] = {"lon0": 134.0, "lat0": -26.0, "k": round(geo.R * geo.SCALE, 6), "ox": round(OX, 3), "oy": round(OY, 3)}
    context = unary_union([geo.country(a) for a in geo.CONTEXT if a in geo.countries()])
    data["context"] = to_path(geo.project(context).simplify(1.0), 2)
    data["contextNames"] = [[n, xy(lon, lat)] for n, lon, lat in
                            [("INDONESIA", 121.0, -8.9), ("PAPUA NEW GUINEA", 145.5, -7.4), ("TIMOR-LESTE", 126.2, -9.6)]]
    data["seaNames"] = [[n, xy(lon, lat)] for n, lon, lat in
                        [("Indian Ocean", 112.6, -38.0), ("Coral Sea", 150.0, -13.5), ("Tasman Sea", 153.0, -39.6),
                         ("Arafura Sea", 136.0, -9.6), ("Timor Sea", 125.0, -12.6), ("Southern Ocean", 128.0, -40.5)]]
    land = geo.project(geo.land())
    data["land"] = to_path(land.simplify(TOL), 0.05)

    pieces, edges, P = build_pieces()
    data["pieces"] = pieces
    data["edges"] = edges
    data["timeline"] = {k: v for k, v in eras.TIMELINE.items() if k in pieces}
    missing = set(pieces) ^ set(eras.TIMELINE)
    assert not missing, f"pieces and timeline do not match: {missing}"
    data["units"] = {k: {"n": n, "c": c, "f": f} for k, (n, c, f) in eras.UNITS.items()}
    data["milestones"] = eras.MILESTONES
    data["claims"] = {k: lines_path(geo.project(g)) for k, g in eras.claim_lines().items()}
    data["ruler"], straight_pct, inner_km = ruler()

    # numbers used in the text
    area = lambda year, units: sum(geo.project(P[k]).area for k in P if eras.unit_at(k, year) in units)
    total = sum(geo.project(g).area for g in P.values())
    data["stats"] = {
        "claim_1788_pct": round(100 * area(1788, {"NSW_C"}) / total),
        "straight_pct": straight_pct,
        "inner_km": inner_km,
    }
    print(data["stats"], {k: v["km"] for k, v in data["ruler"].items()})

    # Your place through time
    places = []
    for name, today, lon, lat in PLACES:
        places.append({"n": name, "today": today, "p": xy(lon, lat), "piece": piece_of(P, lon, lat)})
    data["places"] = places

    js = "// Generated by build/build.py: do not edit by hand\nwindow.GEO = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(js)
    print(OUT, len(js) // 1024, "KB")


if __name__ == "__main__":
    main()
