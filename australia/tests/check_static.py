#!/usr/bin/env python3
"""Static checks (no browser): syntax, local files, ids, data and the history of the borders.

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
    return [[tuple(map(float, p.split(","))) for p in part.rstrip("Z").split("L")] for part in d.split("M")[1:]]


def inside(d, x, y):
    n = 0
    for ring in rings(d):
        for (x1, y1), (x2, y2) in zip(ring, ring[1:] + ring[:1]):
            if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1:
                n += 1
    return n % 2 == 1


def main():
    for f in ("js/app.js", "js/content.js", "data/geo.js"):
        r = subprocess.run(["node", "--check", str(ROOT / f)], capture_output=True, text=True)
        ok(r.returncode == 0, f"{f}: JavaScript syntax" + (f" ({r.stderr.strip()[:200]})" if r.returncode else ""))

    html = (ROOT / "index.html").read_text()
    p = Refs()
    p.feed(html)
    missing = [r for r in p.refs if not (ROOT / r).exists()]
    ok(not missing, "index.html: all local files exist" + (f" ({missing})" if missing else ""))
    ok(not p.external, "index.html: no external scripts, styles or images" + (f" ({p.external})" if p.external else ""))
    dup = sorted({i for i in p.ids if p.ids.count(i) > 1})
    ok(not dup, "index.html: no duplicate ids" + (f" ({dup})" if dup else ""))
    css = (ROOT / "css/style.css").read_text()
    ok(not re.search(r"url\(\s*['\"]?https?:", css) and "@import" not in css, "style.css: no external resources")

    app = (ROOT / "js/app.js").read_text()
    maps = set(re.findall(r'data-map="([^"]+)"', html))
    states = set(re.findall(r'^\s{4}"?([\w-]+)"?\(\) \{', app, re.M))
    ok(maps <= states, "every chapter map has a state in app.js" + (f" (missing {maps - states})" if maps - states else ""))
    for target in re.findall(r'"(#[\w-]+)"', app):
        if target.startswith("#table-") or target in ("#map",):
            ok(f'id="{target[1:]}"' in html, f"app.js writes into {target}, which exists")

    G = load_geo()
    units_used = {u for rows in G["timeline"].values() for _, u in rows}
    ok(units_used <= set(G["units"]), "every unit of the timeline has a name")
    ok(set(G["timeline"]) == set(G["pieces"]), "every piece of today's map has a timeline")
    ok(all(rows[0][0] == 1788 for rows in G["timeline"].values()), "every timeline starts in 1788")
    ok(all(all(a[0] < b[0] for a, b in zip(rows, rows[1:])) for rows in G["timeline"].values()), "every timeline is in order")
    st = G["stats"]
    ok(40 <= st["claim_1788_pct"] <= 60, f"the claim of 1788 is about half the continent ({st['claim_1788_pct']}%)")
    ok(60 <= st["straight_pct"] <= 90, f"most inner borders are straight ({st['straight_pct']}%)")

    # History: who owned these places in these years
    P = G["proj"]
    D = math.pi / 180

    def proj(lon, lat):
        l, f, l0, f0 = lon * D, lat * D, P["lon0"] * D, P["lat0"] * D
        k = math.sqrt(2 / (1 + math.sin(f0) * math.sin(f) + math.cos(f0) * math.cos(f) * math.cos(l - l0)))
        return P["k"] * k * math.cos(f) * math.sin(l - l0) - P["ox"], -P["k"] * k * (math.cos(f0) * math.sin(f) - math.sin(f0) * math.cos(f) * math.cos(l - l0)) - P["oy"]

    def unit_at(lon, lat, year):
        x, y = proj(lon, lat)
        for k, pc in G["pieces"].items():
            if pc.get("d") and inside(pc["d"], x, y):
                return [u for f, u in G["timeline"][k] if f <= year][-1]
    checks = [("Perth", 115.86, -31.95, 1788, "NONE"), ("Perth", 115.86, -31.95, 1829, "WA_C"),
              ("Alice Springs", 133.88, -23.70, 1788, "NONE"), ("Alice Springs", 133.88, -23.70, 1850, "NSW_C"),
              ("Alice Springs", 133.88, -23.70, 1870, "SA_NT"), ("Alice Springs", 133.88, -23.70, 1929, "CENTRAL_A"),
              ("Darwin", 131.0, -12.6, 1929, "NORTH_A"), ("Darwin", 131.0, -12.6, 2026, "NT"),
              ("Melbourne", 144.96, -37.81, 1850, "NSW_C"), ("Melbourne", 144.96, -37.81, 1851, "VIC_C"),
              ("Brisbane", 153.03, -27.47, 1846, "NSW_C"), ("Gladstone", 151.26, -23.85, 1846, "NA"),
              ("Mount Isa", 139.49, -20.73, 1860, "NSW_C"), ("Mount Isa", 139.49, -20.73, 1862, "QLD_C"),
              ("Nullarbor", 130.9, -31.45, 1840, "NSW_C"), ("Nullarbor", 130.9, -31.45, 1861, "SA_C"), ("Ceduna", 133.68, -32.13, 1836, "SA_C"),
              ("Port Augusta", 137.77, -32.49, 1836, "SA_C"), ("Hobart", 147.33, -42.88, 1825, "VDL"),
              ("Canberra", 149.13, -35.28, 1911, "FCT"), ("Canberra", 149.13, -35.28, 2026, "ACT")]
    for name, lon, lat, year, want in checks:
        got = unit_at(lon, lat, year)
        ok(got == want, f"{name} in {year}: {want}" + (f" (got {got})" if got != want else ""))

    print(f"\n{'ALL OK' if not fails else f'{fails} FAILED'}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
