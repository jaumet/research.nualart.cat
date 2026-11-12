#!/usr/bin/env python3
"""List every text that the page code shows from data/geo.js and js/app.js (the keys of js/lang-*.js).

Usage: python3 tests/i18n_keys.py            -> prints the keys as JSON
       (imported by check_static.py to check that a dictionary is complete)
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def keys():
    js = (ROOT / "data/geo.js").read_text()
    G = json.loads(js[js.index("{"): js.rindex("}") + 1])
    k = []
    add = lambda s: s and s not in k and k.append(s)
    for n, _ in G["contextNames"] + G["seaNames"]:
        add(n)
    for era in G["eras"].values():
        for u in era["units"]:
            add(u["n"]); add(u.get("i"))
        for p in era["points"]:
            add(p["n"]); add(p["t"])
    for u in G["units"].values():
        add(u["n"])
        for l in re.split(r",\s*", u.get("lang", "")):
            add(l)
    for _, t in G["milestones"]:
        add(t)
    for p in G["places"]:
        add(p["n"]); add(p["today"])
    app = (ROOT / "js/app.js").read_text()
    for m in re.finditer(r'\bT\("((?:[^"\\]|\\.)*)"', app):
        add(m.group(1))
    for m in re.finditer(r'\b\w+: "([^"]+)"', app[app.index("const CAT_LABEL"): app.index("const KINGDOM")]):
        add(m.group(1))
    for m in re.finditer(r'(?:rock|minor|pillar|state|ut|area): "([^"#][^"]*)"', app):
        add(m.group(1))
    content = (ROOT / "js/content.js").read_text()
    for name in re.findall(r'^\s+\["([^"]+)", "(?:brit|prince)"', content, re.M):
        add(name)
    for l in re.findall(r'(?:^|, )"?([A-Z][\w ()]+)"?: "#', content[content.index("LANG_COLORS"):]):
        add(l.strip())
    return k


if __name__ == "__main__":
    print(json.dumps(keys(), ensure_ascii=False, indent=0))
