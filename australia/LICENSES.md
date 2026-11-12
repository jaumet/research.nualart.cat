# Licences and provenance

## This work

Text, code, map rules and drawings (the River Red Gum narrator, the favicon): © 2026, original idea by
Jaume Nualart ([nualart.cat](https://nualart.cat)), made with the help of an AI agent. Licensed under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

The historical maps of this atlas (1788 to today) are simplified reconstructions made for this work from
the laws and letters patent that created each border. They are not copies of any other map.

The names of Aboriginal and Torres Strait Islander nations and places belong to those peoples. They are
used here to name them, as they are used in public sources; their spelling should be checked with each
community.

## Third-party data

| File | Source | Licence | SHA-256 (as downloaded) |
|---|---|---|---|
| `build/raw/ne_10m_admin_0_countries.geojson` | Natural Earth, Admin 0 Countries 1:10m. Downloaded 12 Nov 2026 from github.com/nvkelso/natural-earth-vector. | Public domain | `239eec57ac17f100a11e2536cffc56752c318b50ae765b0918ff7aab4ce8f255` |
| `build/raw/ne_10m_admin_1_states_provinces.geojson` | Natural Earth, Admin 1 States and Provinces 1:10m. Same source and date. | Public domain | `22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5` |

How they are used (`build/`): Natural Earth gives the land, the coasts, the neighbouring countries and
today's states and territories. `data/geo.js` is generated from these files and from the rules in
`eras.py`.

## Points to check before publishing

- **Cultural protocols.** Australian schools and publishers usually follow protocols for Aboriginal and
  Torres Strait Islander content (for example the AIATSIS *Code of Ethics* and the guides of each state's
  education department). The page carries the usual notice about names of people who have died.
- **Images.** No photographs or artworks are used. If any are added, the rights of the artists and
  communities must be checked.
