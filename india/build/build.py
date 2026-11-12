#!/usr/bin/env python3
"""Build data/geo.js: every map of the atlas, projected and simplified.

    python3 build/build.py

Needs python3 with shapely >= 2.1, numpy and Pillow. Sources are in build/raw/ and build/ref/
(see LICENSES.md); the rules for each era are in build/eras.py.
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
TOL = 0.55  # simplification, in SVG units (1 unit = 4.2 km)
DOT_AREA = 6.0  # units smaller than this (in SVG units²) also get a dot, so they can be seen and tapped

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


def build_era(key):
    era = eras.ERAS[key]()
    units = [u for u in era["units"] if not u["g"].is_empty]
    gs = simplify_all([u["g"] for u in units])
    out = []
    for u, g in zip(units, gs):
        row = {"id": u["id"], "n": u["name"], "c": u["cat"], "d": to_path(g), "l": label_point(g),
               "a": round(geo.project(u["g"]).area)}
        if u["info"]:
            row["i"] = u["info"]
        if row["a"] < DOT_AREA or not row["d"]:
            row["dot"] = 1
            row["l"] = label_point(geo.project(u["g"]))
        out.append(row)
    pts = [{"n": p["name"], "p": xy(p["lon"], p["lat"]), "k": p["kind"], "t": p["note"]} for p in era["points"]]
    return {"units": out, "points": pts}, units


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
            ga, gb = gs[keys.index(a)], gs[keys.index(b)]
            if not ga.buffer(0.01).intersects(gb):
                continue
            line = ga.boundary.intersection(gb.boundary)
            line = shapely.line_merge(line) if line.geom_type in ("MultiLineString", "LineString") else line
            d = lines_path(line)
            if d:
                edges.append([a, b, d])
    return pieces, edges, P


def owner(units, lon, lat):
    pt = Point(lon, lat)
    best = None
    for u in units:
        if u["g"].contains(pt):
            return u
        dist = u["g"].distance(pt)
        if best is None or dist < best[0]:
            best = (dist, u)
    return best[1] if best and best[0] < 0.3 else None


# Places for "Your place through time": name, state today, lon, lat
PLACES = [
    ("Agartala", "Tripura", 91.28, 23.83), ("Agra", "Uttar Pradesh", 78.01, 27.18),
    ("Ahmedabad", "Gujarat", 72.58, 23.03), ("Aizawl", "Mizoram", 92.72, 23.73),
    ("Amritsar", "Punjab", 74.87, 31.63), ("Bengaluru", "Karnataka", 77.59, 12.97),
    ("Bhopal", "Madhya Pradesh", 77.41, 23.26), ("Bhubaneswar", "Odisha", 85.82, 20.30),
    ("Chandigarh", "Chandigarh", 76.78, 30.73), ("Chennai", "Tamil Nadu", 80.27, 13.08),
    ("Dehradun", "Uttarakhand", 78.03, 30.32), ("Delhi", "Delhi", 77.21, 28.61),
    ("Gangtok", "Sikkim", 88.61, 27.33), ("Guwahati", "Assam", 91.74, 26.14),
    ("Hyderabad", "Telangana", 78.47, 17.39), ("Imphal", "Manipur", 93.94, 24.82),
    ("Itanagar", "Arunachal Pradesh", 93.61, 27.08), ("Jaipur", "Rajasthan", 75.79, 26.91),
    ("Jammu", "Jammu and Kashmir", 74.86, 32.73), ("Kohima", "Nagaland", 94.11, 25.67),
    ("Kochi", "Kerala", 76.27, 9.93), ("Kolkata", "West Bengal", 88.36, 22.57),
    ("Leh", "Ladakh", 77.58, 34.16), ("Lucknow", "Uttar Pradesh", 80.95, 26.85),
    ("Madurai", "Tamil Nadu", 78.12, 9.93), ("Mumbai", "Maharashtra", 72.88, 19.08),
    ("Mysuru", "Karnataka", 76.64, 12.30), ("Nagpur", "Maharashtra", 79.09, 21.15),
    ("Panaji", "Goa", 73.83, 15.49), ("Patna", "Bihar", 85.14, 25.59),
    ("Puducherry", "Puducherry", 79.81, 11.93), ("Pune", "Maharashtra", 73.86, 18.52),
    ("Raipur", "Chhattisgarh", 81.63, 21.25), ("Ranchi", "Jharkhand", 85.31, 23.34),
    ("Shillong", "Meghalaya", 91.89, 25.58), ("Shimla", "Himachal Pradesh", 77.17, 31.10),
    ("Srinagar", "Jammu and Kashmir", 74.80, 34.08), ("Surat", "Gujarat", 72.83, 21.17),
    ("Thiruvananthapuram", "Kerala", 76.94, 8.52), ("Varanasi", "Uttar Pradesh", 82.99, 25.32),
    ("Visakhapatnam", "Andhra Pradesh", 83.22, 17.69), ("Amaravati", "Andhra Pradesh", 80.52, 16.51),
    ("Gurugram", "Haryana", 77.03, 28.46), ("Port Blair (Sri Vijaya Puram)", "Andaman and Nicobar Islands", 92.73, 11.62),
    ("Kavaratti", "Lakshadweep", 72.64, 10.57), ("Daman", "Dadra and Nagar Haveli and Daman and Diu", 72.83, 20.41),
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
    data["proj"] = {"lon0": 80.0, "lat0": 22.0, "k": round(geo.R * geo.SCALE, 6), "ox": round(OX, 3), "oy": round(OY, 3)}
    context = unary_union([geo.country(a) for a in geo.CONTEXT if a in geo.countries()])
    data["context"] = to_path(geo.project(context).simplify(1.2), 2)
    data["contextNames"] = [[n, xy(lon, lat)] for n, lon, lat in
                            [("AFGHANISTAN", 66.0, 34.0), ("CHINA", 86.0, 33.5), ("MYANMAR", 96.0, 21.5), ("IRAN", 61.3, 31.5)]]
    data["seaNames"] = [[n, xy(lon, lat)] for n, lon, lat in
                        [("Arabian Sea", 66.0, 15.0), ("Bay of Bengal", 88.5, 15.0), ("Indian Ocean", 80.0, 5.2)]]
    land = geo.project(clean(unary_union([geo.land()])))
    data["land"] = to_path(land.simplify(TOL), 0.05)

    built = {}
    data["eras"] = {}
    for key in eras.ERAS:
        data["eras"][key], built[key] = build_era(key)
        print(key, len(data["eras"][key]["units"]), "units")

    pieces, edges, P = build_pieces()
    data["pieces"] = pieces
    data["edges"] = edges
    data["timeline"] = {k: v for k, v in eras.TIMELINE.items() if k in pieces}
    missing = set(pieces) - set(eras.TIMELINE)
    assert not missing, f"pieces without timeline: {missing}"
    data["units"] = {k: {"n": n, "c": c, **({"lang": l} if l else {})} for k, (n, c, l) in eras.UNITS.items()}
    data["milestones"] = eras.MILESTONES

    # numbers used in the text
    u1909 = built["1909"]
    area = lambda cats, exclude=(): sum(geo.project(u["g"]).area for u in u1909 if u["cat"] in cats and u["id"] not in exclude)
    prince = area({"prince"}, {"shan"})
    brit = area({"brit"}, {"burma", "andaman"})
    data["stats"] = {
        "princely_pct_1909": round(100 * prince / (prince + brit)),
        "maurya_pct": round(100 * sum(geo.project(u["g"].intersection(geo.land())).area for u in built["-250"] if u["cat"] in ("maurya", "core", "conquered"))
                            / geo.project(geo.land()).area),
        "mughal_pct": round(100 * sum(geo.project(u["g"].intersection(geo.land())).area for u in built["1707"] if u["cat"] == "mughal")
                            / geo.project(geo.land()).area),
    }
    print(data["stats"])

    # Your place through time
    places = []
    for name, today, lon, lat in PLACES:
        row = {"n": name, "today": today, "p": xy(lon, lat), "e": {}}
        for key in eras.ERAS:
            u = owner(built[key], lon, lat)
            row["e"][key] = u["name"] if u else None
        pc = piece_of(P, lon, lat)
        row["piece"] = pc
        places.append(row)
    data["places"] = places

    js = "// Generated by build/build.py: do not edit by hand\nwindow.GEO = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
    OUT.parent.mkdir(exist_ok=True)
    OUT.write_text(js)
    print(OUT, len(js) // 1024, "KB")


if __name__ == "__main__":
    main()
