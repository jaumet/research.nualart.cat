#!/usr/bin/env bash
# Downloads the sources again into build/raw/ and build/ref/ (they are already included; only needed to update them)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p raw ref
NE=https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson
curl -fL -o raw/ne_10m_admin_0_countries_ind.geojson "$NE/ne_10m_admin_0_countries_ind.geojson"
curl -fL -o raw/ne_10m_admin_1_states_provinces.geojson "$NE/ne_10m_admin_1_states_provinces.geojson"
# Reference maps (public domain), from Wikimedia Commons. If they change, the control points in georef.py must be checked.
UA="WhoDrewTheseLines/0.1 (https://nualart.cat)"
curl -fL -A "$UA" -o ref/gazetteer_1909.jpg "https://upload.wikimedia.org/wikipedia/commons/3/36/British_Indian_Empire_1909_Imperial_Gazetteer_of_India.jpg"
curl -fL -A "$UA" -o ref/colbeck_1760.jpg "https://commons.wikimedia.org/wiki/Special:FilePath/India1760_1905.jpg"
sha256sum raw/*.geojson ref/*.jpg
