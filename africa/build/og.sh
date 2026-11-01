#!/usr/bin/env bash
# Genera les imatges per compartir (Open Graph) a img/og-*.jpg a partir de build/og.html.
# La finestra és més alta que la imatge perquè Chrome sense finestra resta espai a la vista; després es retalla.
# Cal Google Chrome o Chromium i ImageMagick.
set -euo pipefail
cd "$(dirname "$0")/.."
chrome="$(command -v google-chrome || command -v chromium-browser || command -v chromium)"
tmp="$(mktemp -d)"
for v in "ca:0:og-ca" "ca:1:og-ca-infants" "en:0:og-en" "en:1:og-en-kids"; do
  IFS=: read -r lang kids name <<< "$v"
  "$chrome" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
    --user-data-dir="$tmp/profile" --window-size=1200,900 --virtual-time-budget=3000 \
    --screenshot="$tmp/$name.png" "file://$PWD/build/og.html?lang=$lang&kids=$kids" 2>/dev/null
  convert "$tmp/$name.png" -crop 1200x630+0+0 +repage -strip -quality 86 "img/$name.jpg"
  echo "img/$name.jpg"
done
rm -rf "$tmp"
