#!/usr/bin/env python3
"""Genera data/geo.js a partir de les fonts obertes de build/raw/.

Fonts (es descarreguen amb build/fetch.sh):
  - ne50.geojson                Natural Earth 1:50m Admin 0 (domini públic)
  - world_1880/1914.geojson     aourednik/historical-basemaps (GPL-3.0)
  - Murdock_EA_2011_vkZ.geojson Mapa etnolingüístic de G. P. Murdock (1959),
                                digitalitzat per N. Nunn (CC BY-NC-SA 3.0)

Totes les capes es projecten en Lambert azimutal d'àrees iguals centrada a
l'Àfrica, de manera que les àrees (i els percentatges de partició) són comparables.

Requereix: python3 + shapely  (pip install --user shapely)
"""
import json
import math
from pathlib import Path

import numpy as np
import shapely
from shapely.geometry import shape, box, Polygon, MultiPolygon, GeometryCollection
from shapely.ops import unary_union, polylabel

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw"
OUT = ROOT.parent / "data" / "geo.js"

LON0, LAT0 = math.radians(17.0), math.radians(2.0)
SCALE = 1 / 9.0  # km -> unitats SVG
R = 6371.0


def laea(lon, lat):
    l, p = math.radians(lon), math.radians(lat)
    k = math.sqrt(2 / (1 + math.sin(LAT0) * math.sin(p) + math.cos(LAT0) * math.cos(p) * math.cos(l - LON0)))
    x = R * k * math.cos(p) * math.sin(l - LON0)
    y = R * k * (math.cos(LAT0) * math.sin(p) - math.sin(LAT0) * math.cos(p) * math.cos(l - LON0))
    return x * SCALE, -y * SCALE


def proj(g):
    return shapely.transform(g, lambda c: np.array([laea(x, y) for x, y in c]))


# Coordenades de sortida: desplaçades perquè el viewBox comenci a (0, 0)
BBOX_GEO = box(-30, -42, 66, 44)


def polys(g):
    if g.is_empty:
        return []
    if isinstance(g, Polygon):
        return [g]
    if isinstance(g, (MultiPolygon, GeometryCollection)):
        return [p for part in g.geoms for p in polys(part)]
    return []


def clean(g):
    g = g.buffer(0)
    return MultiPolygon(polys(g)) if not isinstance(g, Polygon) else g


def to_path(g, tol, ox, oy, min_area=0.0):
    out = []
    for p in polys(g.simplify(tol, preserve_topology=True)):
        if p.area < min_area:
            continue
        for ring in [p.exterior, *p.interiors]:
            pts = list(ring.coords)[:-1]
            if len(pts) < 3:
                continue
            out.append("M" + "L".join(f"{x - ox:.1f},{y - oy:.1f}".replace(".0,", ",").replace(".0L", "L") for x, y in pts) + "Z")
    return "".join(out).replace(".0Z", "Z")


def label_point(g):
    parts = polys(g)
    if not parts:
        return None
    big = max(parts, key=lambda p: p.area)
    try:
        pt = polylabel(big, tolerance=1.0)
    except Exception:
        pt = big.representative_point()
    return pt.x, pt.y


def load(name):
    return json.loads((RAW / name).read_text())


# ---------------------------------------------------------------- Natural Earth
ne = load("ne50.geojson")["features"]
SKIP = {"IOT", "ATF", "HMD", "IOA", "SHN"}
countries = {}
context = []
for f in ne:
    p = f["properties"]
    g = shape(f["geometry"])
    if p["ADM0_A3"] in SKIP:
        continue
    if p["CONTINENT"] == "Africa" or p["ADM0_A3"] in {"SYC", "MUS"}:
        countries[p["ADM0_A3"]] = clean(proj(g))
    elif g.intersects(BBOX_GEO):
        context.append(proj(clean(g.intersection(BBOX_GEO))))

land = unary_union(list(countries.values())).buffer(0)
context_land = unary_union(context).buffer(0)

minx, miny, maxx, maxy = proj(BBOX_GEO).bounds
# retall final del marc: centrat a l'Àfrica amb una mica d'Europa i Aràbia
ax0, ay0, ax1, ay1 = land.bounds
pad = 40
ox, oy = ax0 - pad, ay0 - pad * 2.2
W, H = (ax1 - ax0) + pad * 2, (ay1 - ay0) + pad * 3.2
frame = box(ox, oy, ox + W, oy + H)
context_land = context_land.intersection(frame)


def shares(g, units, min_share):
    """Percentatge de l'àrea de g dins de cada unitat."""
    a = g.area
    if a == 0:
        return []
    res = []
    for k, u in units.items():
        if not g.intersects(u):
            continue
        s = g.intersection(u).area / a
        if s >= min_share:
            res.append([k, round(s * 100, 1)])
    return sorted(res, key=lambda r: -r[1])


# ---------------------------------------------------------------- Capes històriques
# Correccions del conjunt de dades de 1880 (vegeu les notes a js/history.js):
#  - «Ato» és un error tipogràfic per la confederació aro (sud-est de Nigèria)
#  - «Congo» (sota França) és, per la seva localització, el regne del Kongo
#  - «Lozi» i «Barotse» són el mateix regne
FIX_NAMES = {"Ato trading confederacy": "Aro Confederacy", "Sultinate of Zanzibar": "Sultanate of Zanzibar",
             "Congo": "Kongo Kingdom", "Barotse": "Lozi"}


def historical(fname):
    out = []
    for f in load(fname)["features"]:
        if not f["geometry"]:
            continue
        name = f["properties"].get("NAME")
        if not name:
            continue
        g = clean(proj(shape(f["geometry"]))).intersection(land)
        g = clean(g)
        if g.area < 4:  # descarta encreuaments marginals amb la costa
            continue
        lp = label_point(g)
        out.append({
            "n": FIX_NAMES.get(name, name),
            "d": to_path(g, 0.7, ox, oy, 0.5),
            "a": round(g.area),
            "l": [round(lp[0] - ox, 1), round(lp[1] - oy, 1)],
            "today": shares(g, countries, 0.01),
        })
    # fusiona peces amb el mateix nom (el conjunt de dades en té algunes de repetides)
    merged = {}
    for item in out:
        m = merged.get(item["n"])
        if m is None:
            merged[item["n"]] = item
        else:
            m["d"] += item["d"]
            if item["a"] > m["a"]:
                m["l"] = item["l"]
            m["a"] += item["a"]
            seen = {k for k, _ in m["today"]}
            m["today"] += [t for t in item["today"] if t[0] not in seen]
    return list(merged.values())


p1880 = historical("world_1880.geojson")

# ---------------------------------------------------------------- 1914
# El conjunt de dades de 1914 té errors greus (Somalilàndia britànica i italiana
# intercanviades; el Txad i Ubangui-Xari dins de l'Àfrica Occidental Francesa...).
# Les unitats es reconstrueixen agrupant països actuals; només es prenen del conjunt
# de dades les peces on la frontera de 1914 era realment diferent de l'actual.
raw1914 = {}
for f in load("world_1914.geojson")["features"]:
    n = f["properties"].get("NAME")
    if n and f["geometry"]:
        g = clean(proj(shape(f["geometry"]))).intersection(land)
        raw1914[n] = raw1914[n].union(g) if n in raw1914 else g


def U(*codes):
    return unary_union([countries[c] for c in codes])


kamerun = raw1914["Kamerun"]                                     # inclou el Nou Kamerun (1911–1916)
togoland = raw1914["Togoland"].intersection(U("TGO", "GHA"))     # Togolàndia sencera (abans de la partició)
jubaland = raw1914["British East Africa"].intersection(countries["SOM"])  # britànica fins al 1925
rudolf = raw1914["Uganda"].intersection(countries["KEN"])        # província de Rudolf, ugandesa fins al 1926
spanish_south = unary_union([raw1914["Rio De Oro"], raw1914["Spanish Sahara"], countries["SAH"]]).intersection(U("SAH", "MAR"))
spanish_north = raw1914["Spanish Morocco"].intersection(countries["MAR"])

UNITS_1914 = {
    "Morocco": countries["MAR"].difference(spanish_south).difference(spanish_north),
    "Spanish Morocco": spanish_north,
    "Spanish Sahara": spanish_south,
    "Algeria": U("DZA"), "Tunisia": U("TUN"), "Libya": U("LBY"), "Egypt": U("EGY"),
    "Anglo-Egyptian Sudan": U("SDN", "SDS"), "Eritrea": U("ERI"), "Abyssinia": U("ETH"), "Djibouti": U("DJI"),
    "British Somaliland": U("SOL"), "Italian Somaliland": countries["SOM"].difference(jubaland),
    "British East Africa": countries["KEN"].difference(rudolf).union(jubaland),
    "Uganda": countries["UGA"].union(rudolf),
    "German East Africa": U("TZA", "RWA", "BDI"),
    "Belgian Congo": U("COD"), "Angola": U("AGO"), "Mozambique": U("MOZ"), "Nyasaland": U("MWI"),
    "Rhodesia": U("ZMB", "ZWE"), "Bechuanaland": U("BWA"), "German South-West Africa": U("NAM"),
    "Union of South Africa": U("ZAF"), "Basutoland": U("LSO"), "Swaziland": U("SWZ"),
    "Madagascar": U("MDG", "COM"),
    "Kamerun": kamerun,
    "French Equatorial Africa": U("GAB", "COG", "CAF", "TCD").difference(kamerun),
    "Nigeria": countries["NGA"].difference(kamerun),
    "French West Africa": U("MRT", "SEN", "MLI", "GIN", "CIV", "BFA", "NER", "BEN").difference(togoland),
    "Togoland": togoland, "Gold Coast": countries["GHA"].difference(togoland),
    "Gambia": U("GMB"), "Portuguese Guinea": U("GNB"), "Sierra Leone": U("SLE"), "Liberia": U("LBR"),
    "Spanish Guinea": U("GNQ"), "Cape Verde": U("CPV"), "Sao Tome": U("STP"), "Mauritius": U("MUS"), "Seychelles": U("SYC"),
}
units1914 = {k: clean(g) for k, g in UNITS_1914.items() if not g.is_empty}
p1914 = []
for n, g in units1914.items():
    lp = label_point(g)
    p1914.append({"n": n, "d": to_path(g, 0.7, ox, oy, 0.05), "a": round(g.area),
                  "l": [round(lp[0] - ox, 1), round(lp[1] - oy, 1)], "today": shares(g, countries, 0.01)})


def title(s):
    return " ".join(w.capitalize() if not w.isupper() or len(w) > 1 else w for w in s.lower().split()).replace("-", "-")


# Murdock (1959) fa servir alguns exònims colonials pejoratius: es substitueixen
GROUP_FIX = {"Galla": "Oromo", "Hottentot": "Khoikhoi", "Bushmen": "San", "Dorobo": "Okiek (Dorobo)",
             "Arabs, Bedoin": "Àrabs beduïns"}
# i alguns noms de poble: «Beraber» és el nom àrab (plural de «berber»); ells s'anomenen Imazighen
NAME_FIX = {"Beraber": "Imazighen (Beraber)"}
SOMALI = {"Mijertein", "Ogaden", "Hawiya", "Ishaak", "Esa", "Geri", "Shebelle", "Gosha"}

peoples = []
for f in load("Murdock_EA_2011_vkZ.geojson")["features"]:
    if not f["geometry"]:
        continue
    p = f["properties"]
    g = clean(proj(shape(f["geometry"]))).intersection(land)
    g = clean(g)
    if g.area < 0.5:
        continue
    name = "-".join(title(w) for w in p["NAME"].split("-"))
    if name.startswith("Uninhabited"):
        continue
    name = NAME_FIX.get(name, name)
    group = GROUP_FIX.get(p.get("CultureGrp") or "", p.get("CultureGrp") or "")
    if name in SOMALI:
        group = "Somali"
    lp = label_point(g)
    sh = shares(g, countries, 0.01)
    sh14 = shares(g, units1914, 0.01)
    peoples.append({
        "n": name,
        "g": group,
        "d": to_path(g, 0.9, ox, oy, 0.3),
        "a": round(g.area),
        "l": [round(lp[0] - ox, 1), round(lp[1] - oy, 1)],
        "s": sh,      # països actuals
        "s14": sh14,  # unitats colonials 1914
    })

# ---------------------------------------------------------------- Gratícula
def graticule():
    lines = []
    for lat in range(-40, 45, 10):
        lines.append([laea(lon, lat) for lon in range(-30, 67, 2)])
    for lon in range(-30, 70, 10):
        lines.append([laea(lon, lat) for lat in range(-42, 45, 2)])
    special = {name: [laea(lon, lat) for lon in range(-30, 67, 2)] for name, lat in
               [("equator", 0), ("cancer", 23.44), ("capricorn", -23.44)]}

    def d(pts):
        return "M" + "L".join(f"{x - ox:.1f},{y - oy:.1f}" for x, y in pts)
    return "".join(d(l) for l in lines), {k: d(v) for k, v in special.items()}


grat, special = graticule()

data = {
    "viewBox": [0, 0, round(W, 1), round(H, 1)],
    "proj": {"lon0": 17.0, "lat0": 2.0, "scale": SCALE, "ox": ox, "oy": oy},
    "context": to_path(context_land, 1.2, ox, oy, 2),
    "land": to_path(land, 0.7, ox, oy, 0.2),
    "graticule": grat,
    "lines": special,
    "countries": {
        k: {
            "d": to_path(g, 0.6, ox, oy, 0.05),
            "a": round(g.area),
            "l": [round(label_point(g)[0] - ox, 1), round(label_point(g)[1] - oy, 1)],
        }
        for k, g in countries.items()
    },
    "p1880": p1880,
    "p1914": p1914,
    "peoples": peoples,
}

OUT.write_text("/* Generat per build/build.py — no editar a mà */\nwindow.GEO = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n")
part = [p for p in peoples if len(p["s"]) > 1 and p["s"][1][1] >= 10]
print(f"geo.js: {OUT.stat().st_size / 1024:.0f} KB · països {len(countries)} · 1880 {len(p1880)} · 1914 {len(p1914)} · pobles {len(peoples)} · partits (>=10%) {len(part)}")
