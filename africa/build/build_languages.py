#!/usr/bin/env python3
"""Genera data/languages.js a partir de Glottolog (CC BY 4.0).

Entrada: build/raw/glottolog/languages.csv i values.csv (vegeu build/fetch.sh).
Cada llengua és un punt al centre aproximat de la seva àrea segons Glottolog.
Requereix haver executat abans build/build.py (en llegeix la projecció de data/geo.js).
"""
import csv
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "raw" / "glottolog"
DATA = ROOT.parent / "data"

geo = (DATA / "geo.js").read_text()
proj = json.loads(geo[geo.index("=") + 1:].strip().rstrip(";"))["proj"]
R = 6371.0
LON0, LAT0 = math.radians(proj["lon0"]), math.radians(proj["lat0"])


def laea(lon, lat):
    l, p = math.radians(lon), math.radians(lat)
    k = math.sqrt(2 / (1 + math.sin(LAT0) * math.sin(p) + math.cos(LAT0) * math.cos(p) * math.cos(l - LON0)))
    x = R * k * math.cos(p) * math.sin(l - LON0) * proj["scale"] - proj["ox"]
    y = -R * k * (math.cos(LAT0) * math.sin(p) - math.sin(LAT0) * math.cos(p) * math.cos(l - LON0)) * proj["scale"] - proj["oy"]
    return round(x, 1), round(y, 1)


# Agrupació de famílies. Glottolog no accepta «nilo-sahariana» ni «khoisan» com a famílies
# demostrades: aquí s'agrupen per llegibilitat i es diu explícitament a la llegenda.
GROUPS = {
    "Atlantic-Congo": "ac", "Mande": "nc", "Kru": "nc", "Dogon": "nc", "Ijoid": "nc",
    "Afro-Asiatic": "aa",
    "Nilotic": "ns", "Central Sudanic": "ns", "Surmic": "ns", "Saharan": "ns", "Songhay": "ns", "Nubian": "ns",
    "Maban": "ns", "Furan": "ns", "Dajuic": "ns", "Tamaic": "ns", "Eastern Jebel": "ns", "Temeinic": "ns",
    "Nyimang": "ns", "Kuliak": "ns", "Koman": "ns", "Gumuz": "ns", "Kresh-Aja": "ns", "Berta": "ns",
    "Kunama": "ns", "Blue Nile Mao": "ns", "Mimi-Gaudefroy": "ns",
    "Khoe-Kwadi": "ks", "Tuu": "ks", "Kxa": "ks",
    "Austronesian": "an",
    "Indo-European": "co",
}
ISOLATE_GROUP = {"Hadza": "ks", "Sandawe": "ks", "Kunama": "ns", "Berta": "ns", "Nara": "ns"}
AFRICAN_OUTSIDE = {"Guanche"}  # parlada a les Canàries (geogràficament africanes)

# Codis ISO de països (Glottolog) → codis de Natural Earth fets servir al web
ISO2 = {}
for f in json.loads((ROOT / "raw" / "ne50.geojson").read_text())["features"]:
    p = f["properties"]
    if p["ISO_A2"] and p["ISO_A2"] != "-99":
        ISO2[p["ISO_A2"]] = p["ADM0_A3"]
ISO2.update({"EH": "SAH", "SS": "SDS", "SO": "SOM"})

langs = {r["ID"]: r for r in csv.DictReader(open(RAW / "languages.csv", encoding="utf-8"))}
aes, cat = {}, {}
for r in csv.DictReader(open(RAW / "values.csv", encoding="utf-8")):
    if r["Parameter_ID"] == "aes":
        aes[r["Language_ID"]] = int(r["Value"])
    elif r["Parameter_ID"] == "category":
        cat[r["Language_ID"]] = r["Value"]

out = []
for r in langs.values():
    if r["Level"] != "language" or not r["Latitude"]:
        continue
    if "Africa" not in r["Macroarea"] and r["Name"] not in AFRICAN_OUTSIDE:
        continue
    c = cat.get(r["ID"])
    if c not in ("Spoken_L1_Language", "Pidgin"):
        continue  # s'exclouen llengües de signes, registres i entrades «bookkeeping»
    lat, lon = float(r["Latitude"]), float(r["Longitude"])
    if not (-40 < lat < 40 and -30 < lon < 66):
        continue
    fam = langs[r["Family_ID"]]["Name"] if r["Family_ID"] else ""
    group = "co" if c == "Pidgin" else GROUPS.get(fam) or ISOLATE_GROUP.get(r["Name"]) or "ot"
    last = r["Last_Year_Of_Documentation"] or r["First_Year_Of_Documentation"]
    x, y = laea(lon, lat)
    out.append([x, y, r["Name"], group, fam or "aïllada o no classificada", aes.get(r["ID"], 0),
                ",".join(ISO2.get(c, c) for c in r["Countries"].split(";") if c), int(last) if last else None, r["ID"]])

out.sort(key=lambda o: o[5])  # les extingides es dibuixen a sobre
(DATA / "languages.js").write_text(
    "/* Generat per build/build_languages.py a partir de Glottolog (CC BY 4.0) — no editar a mà */\n"
    "/* [x, y, nom, grup, família, estat (0 desconegut · 1 segura … 6 extingida), països, any darrera documentació, glottocode] */\n"
    "window.LANGS = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n")
ext = [o for o in out if o[5] == 6]
print(f"languages.js: {(DATA / 'languages.js').stat().st_size / 1024:.0f} KB · {len(out)} llengües · {len(ext)} extingides · "
      f"{sum(1 for o in ext if o[7] and o[7] >= 1880)} documentades per darrer cop després de 1880")
