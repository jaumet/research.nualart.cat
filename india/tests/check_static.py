#!/usr/bin/env python3
"""Static checks (no browser): syntax, local files, ids, data and the official outline of India.

Usage: python3 tests/check_static.py
"""
import json
import math
import re
import subprocess
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LANGS = ["hi", "pa"]  # translations, each in <code>/index.html, js/lang-<code>.js and js/content-<code>.js
fails = 0


def ok(cond, msg):
    global fails
    print(("ok   " if cond else "FAIL ") + msg)
    fails += not cond


class Refs(HTMLParser):
    def __init__(self):
        super().__init__()
        self.refs, self.ids, self.external = [], [], []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            self.ids.append(a["id"])
        for k in ("src", "href"):
            v = a.get(k)
            if not v or v.startswith(("#", "mailto:")):
                continue
            if v.startswith(("http://", "https://", "//")):
                if tag != "a":  # links to read more are fine; resources must be local
                    self.external.append(v)
                continue
            self.refs.append(v.split("#")[0].split("?")[0])


def load_geo():
    js = (ROOT / "data/geo.js").read_text()
    return json.loads(js[js.index("{"): js.rindex("}") + 1])


def rings(d):
    out = []
    for part in d.split("M")[1:]:
        pts = [tuple(map(float, p.split(","))) for p in part.rstrip("Z").split("L")]
        out.append(pts)
    return out


def inside(d, x, y):
    n = 0
    for ring in rings(d):
        for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
                n += 1
    return n % 2 == 1


def main():
    for f in ("js/app.js", "js/content.js", "data/geo.js", *(f"js/{k}-{l}.js" for l in LANGS for k in ("lang", "content"))):
        r = subprocess.run(["node", "--check", str(ROOT / f)], capture_output=True, text=True)
        ok(r.returncode == 0, f"{f}: JavaScript syntax" + (f" ({r.stderr.strip()[:200]})" if r.returncode else ""))

    pages = {}
    for page in ("index.html", *(f"{l}/index.html" for l in LANGS)):
        html = (ROOT / page).read_text()
        p = Refs()
        p.feed(html)
        pages[page] = (html, p)
        base = (ROOT / page).parent
        missing = [r for r in p.refs if not (base / r).exists()]
        ok(not missing, f"{page}: all local files exist" + (f" ({missing})" if missing else ""))
        ok(not p.external, f"{page}: no external scripts, styles or images" + (f" ({p.external})" if p.external else ""))
        dup = sorted({i for i in p.ids if p.ids.count(i) > 1})
        ok(not dup, f"{page}: no duplicate ids" + (f" ({dup})" if dup else ""))
    en, pe = pages["index.html"]
    for l in LANGS:
        tr, pt = pages[f"{l}/index.html"]
        ok(pe.ids == pt.ids, f"{l}/index.html: same ids, in the same order, as the English page")
        ok(re.findall(r'data-map="([^"]+)"', en) == re.findall(r'data-map="([^"]+)"', tr), f"{l}/index.html: same chapters and maps")
        ok(f'<html lang="{l}">' in tr and tr.index(f"lang-{l}.js") < tr.index("js/app.js") and tr.index(f"content-{l}.js") < tr.index("js/app.js"),
           f"{l}/index.html: lang={l}, dictionary and translated content load before app.js")
        for other in ("index.html", *(f"{o}/index.html" for o in LANGS if o != l)):
            ok(any(r.endswith(other) for r in pt.refs), f"{l}/index.html: links to {other}")
    html = en
    css = (ROOT / "css/style.css").read_text()
    ok(not re.search(r"url\(\s*['\"]?https?:", css) and "@import" not in css, "style.css: no external resources")

    app = (ROOT / "js/app.js").read_text()
    maps = set(re.findall(r'data-map="([^"]+)"', html))
    states = set(re.findall(r'^\s{4}"?([\w-]+)"?\(\) \{', app, re.M))
    ok(maps <= states, f"every chapter map has a state in app.js" + (f" (missing {maps - states})" if maps - states else ""))

    G = load_geo()
    sys.path.insert(0, str(ROOT / "tests"))
    import i18n_keys
    for l in LANGS:
        dic = subprocess.run(["node", "-e", "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.LANG_DICT))",
                              str(ROOT / f"js/lang-{l}.js")], capture_output=True, text=True)
        dic = json.loads(dic.stdout)
        miss = [k for k in i18n_keys.keys() if k not in dic]
        ok(not miss, f"js/lang-{l}.js: every text of the maps and the code is translated ({len(dic)} entries)" + (f" (missing {miss[:8]})" if miss else ""))
        cnt = subprocess.run(["node", "-e", "global.window={};require(process.argv[1]);const e=JSON.stringify(Object.fromEntries(Object.entries(window.CONTENT).map(([k,v])=>[k,Array.isArray(v)?v.length:Object.keys(v).length])));"
                              "require(process.argv[2]);console.log(e+'|'+JSON.stringify(Object.fromEntries(Object.entries(window.CONTENT).map(([k,v])=>[k,Array.isArray(v)?v.length:Object.keys(v).length]))))",
                              str(ROOT / "js/content.js"), str(ROOT / f"js/content-{l}.js")], capture_output=True, text=True).stdout.strip().split("|")
        ok(len(cnt) == 2 and cnt[0] == cnt[1], f"js/content-{l}.js: same number of scripts, places, cities, cards and questions as English")
    for key, era in G["eras"].items():
        bad = [u["n"] for u in era["units"] if not u.get("d") and not u.get("dot")]
        ok(len(era["units"]) > 5 and not bad, f"era {key}: {len(era['units'])} units, all drawn" + (f" ({bad})" if bad else ""))
    units_used = {u for rows in G["timeline"].values() for _, u in rows}
    ok(units_used <= set(G["units"]), "every unit of the timeline has a name")
    ok(set(G["timeline"]) == set(G["pieces"]), "every piece of today's map has a timeline")
    ok(0 < G["stats"]["princely_pct_1909"] < 60, f"princely states share in 1909 is plausible ({G['stats']['princely_pct_1909']}%)")

    # The official outline of India: these places must be drawn inside India, never in a neighbour
    P = G["proj"]
    D = math.pi / 180

    def proj(lon, lat):
        l, f, l0, f0 = lon * D, lat * D, P["lon0"] * D, P["lat0"] * D
        k = math.sqrt(2 / (1 + math.sin(f0) * math.sin(f) + math.cos(f0) * math.cos(f) * math.cos(l - l0)))
        return P["k"] * k * math.cos(f) * math.sin(l - l0) - P["ox"], -P["k"] * k * (math.cos(f0) * math.sin(f) - math.sin(f0) * math.cos(f) * math.cos(l - l0)) - P["oy"]
    checks = [("Gilgit", 74.31, 35.92, "Ladakh"), ("Skardu", 75.63, 35.30, "Ladakh"), ("Aksai Chin", 79.3, 35.2, "Ladakh"),
              ("Muzaffarabad", 73.47, 34.37, "Jammu and Kashmir"), ("Mirpur", 73.75, 33.15, "Jammu and Kashmir"),
              ("Srinagar", 74.80, 34.08, "Jammu and Kashmir"), ("Tawang", 91.86, 27.59, "Arunachal Pradesh"),
              ("Itanagar", 93.61, 27.08, "Arunachal Pradesh")]
    for name, lon, lat, piece in checks:
        x, y = proj(lon, lat)
        ok(inside(G["pieces"][piece]["d"], x, y), f"official map: {name} is drawn in {piece}")
        ok(any(u["id"] in ("kashmir", "ebengal") and inside(u["d"], x, y) for u in G["eras"]["1909"]["units"]),
           f"1909: {name} is drawn inside the Indian Empire")
    tl = G["timeline"]
    ok([u for _, u in tl["Ladakh"]][-1] == "LADAKH" and [u for _, u in tl["Jammu and Kashmir"]][-1] == "JK_UT",
       "today: Jammu and Kashmir and Ladakh are union territories of India")

    print(f"\n{'ALL OK' if not fails else f'{fails} FAILED'}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
