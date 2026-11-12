#!/usr/bin/env bash
# Runs all the checks: static ones, then the browser ones (needs Chrome or Chromium)
set -u
cd "$(dirname "$0")/.."
python3 tests/check_static.py; a=$?
python3 tests/browser.py "$@"; b=$?
exit $(( a || b ))
