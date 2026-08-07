#!/usr/bin/env bash

set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$project_dir"

branch="$(git branch --show-current)"
if [[ -z "$branch" ]]; then
  echo "Error: Git is in detached HEAD state; switch to a branch before publishing." >&2
  exit 1
fi

git add -u -- area-glocolici
git add -- publish.sh area-glocolici/js/glotolici-embed.js

if git diff --cached --quiet; then
  echo "Nothing to publish: the Glotolici files have no staged changes."
  exit 0
fi

git status --short
git commit -m "Add interactive Glotolici scrollytelling embeds and clean share URLs"
git push origin "$branch"

echo "Published branch '$branch' to origin."
