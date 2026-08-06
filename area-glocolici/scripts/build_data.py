#!/usr/bin/env python3
"""Converteix el CSV mestre de Glotolici en un recurs JavaScript autocontingut."""

import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parents[1] / "casos_gentilici_glotonim_ampliat.csv"
TARGET = ROOT / "data" / "glotolici-data.js"


def main():
    with SOURCE.open(encoding="utf-8-sig", newline="") as source:
        rows = list(csv.DictReader(source))

    payload = json.dumps(rows, ensure_ascii=False, separators=(",", ":"))
    TARGET.write_text(
        "// Fitxer generat per scripts/build_data.py. No l'editeu manualment.\n"
        f"window.GLOTOLICI_DATA={payload};\n",
        encoding="utf-8",
    )
    print(f"Generats {len(rows)} casos a {TARGET.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
