#!/usr/bin/env bash
# Descarrega les dades de base a build/raw/ (ja hi són incloses; només cal per actualitzar-les)
set -euo pipefail
cd "$(dirname "$0")/raw"
HB=https://raw.githubusercontent.com/aourednik/historical-basemaps/master/geojson
curl -fL -o world_1880.geojson "$HB/world_1880.geojson"
curl -fL -o world_1914.geojson "$HB/world_1914.geojson"
curl -fL -o ne50.geojson https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_admin_0_countries.geojson
curl -fL -o Murdock_EA_2011_vkZ.geojson https://raw.githubusercontent.com/sboysel/murdock/master/data-raw/Murdock_EA_2011_vkZ.geojson
# Glottolog (CC BY 4.0) per a la capa de llengües
mkdir -p glottolog
GL=https://raw.githubusercontent.com/glottolog/glottolog-cldf/master/cldf
curl -fL -o glottolog/languages.csv "$GL/languages.csv"
curl -fL -o glottolog/values.csv "$GL/values.csv"
