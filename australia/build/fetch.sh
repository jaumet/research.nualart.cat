#!/usr/bin/env bash
# Downloads the sources again into build/raw/ (they are already included; only needed to update them)
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p raw
NE=https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson
curl -fL -o raw/ne_10m_admin_0_countries.geojson "$NE/ne_10m_admin_0_countries.geojson"
curl -fL -o raw/ne_10m_admin_1_states_provinces.geojson "$NE/ne_10m_admin_1_states_provinces.geojson"
sha256sum raw/*.geojson
