# Licences and provenance

## This work

Text, code, map rules and drawings (the Banyan narrator, the favicon): © 2026, original idea by
Jaume Nualart ([nualart.cat](https://nualart.cat)), made with the help of an AI agent. Licensed under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). This includes the Hindi and Punjabi translations
(`hi/`, `pa/`, `js/lang-*.js`, `js/content-*.js`).

The historical maps of this atlas (250 BCE, 1707, 1760, 1909, 1947, 1956) are simplified reconstructions
made for this work from the sources below. They are not copies of any of them.

## Third-party data

| File | Source | Licence | SHA-256 (as downloaded) |
|---|---|---|---|
| `build/raw/ne_10m_admin_0_countries_ind.geojson` | Natural Earth, Admin 0 Countries 1:10m, India point of view. Downloaded 12 Nov 2026 from github.com/nvkelso/natural-earth-vector (version 5.2.0-pre). | Public domain | `3e67a5a6ddeff3247ca8400cd2514fd4a5ac6e5432823b25d610a7028597d45f` |
| `build/raw/ne_10m_admin_1_states_provinces.geojson` | Natural Earth, Admin 1 States and Provinces 1:10m. Same source and date. | Public domain | `22d0e3ad85eb3e27f17cabf8ba2d50e554fbc27a87796ff891d958185da62fb5` |
| `build/ref/gazetteer_1909.jpg` | J. G. Bartholomew and Sons (Edinburgh Geographical Institute), "Political Divisions of the Indian Empire", *Imperial Gazetteer of India*, Atlas, plate 20, Oxford: Clarendon Press, 1909. Scan from Wikimedia Commons, [File:British Indian Empire 1909 Imperial Gazetteer of India.jpg](https://commons.wikimedia.org/wiki/File:British_Indian_Empire_1909_Imperial_Gazetteer_of_India.jpg). | Public domain (published 1909) | `8bbc37c808c7da9de7c97f38fe9751d5adc6886ea8b28c909815979847a54438` |
| `build/ref/colbeck_1760.jpg` | C. Colbeck (1847–1903), "India in the time of Clive, 1760", *The Public Schools Historical Atlas*, London: Longmans, Green & Co., 1884 (1905 edition). Scan from Wikimedia Commons, [File:India1760 1905.jpg](https://commons.wikimedia.org/wiki/File:India1760_1905.jpg). | Public domain (author died 1903) | `fd46a8315dba910024a72a12cef7ea2df92aee00f779dca66320a3cfa7aebac6` |

How they are used (`build/`):

- Natural Earth gives the land, the coasts and today's states. The disputed areas that Natural Earth's
  admin-1 layer leaves outside India are given to the union territory they belong to in the official map
  of India (`geo.py`, function `admin1`).
- The two old maps are only *read*: they are georeferenced with points of their graticule and the colour of
  each area is sampled (`georef.py`). Only the borders between colours are used; coasts and outer borders
  come from Natural Earth. The images are not published with the page.
- `data/geo.js` is generated from these files and from the rules in `eras.py`.

## Points to check before publishing

- **Maps of India in India.** Publishing maps that show India's external boundaries is regulated in India
  (Survey of India; *Guidelines for acquiring and producing Geospatial Data*, 2021; and the criminal law on
  wrong depictions of the boundary). The outline used here is Natural Earth's "India" point of view and the
  tests check that Jammu and Kashmir (with Mirpur and Muzaffarabad), Ladakh (with Gilgit-Baltistan and
  Aksai Chin) and Arunachal Pradesh are drawn inside India on every map. Before a school or publisher in
  India uses the page, the outline should be compared with the latest political map of India from the
  Survey of India, and the page should carry the disclaimer that publisher uses.
- **Small borders.** Natural Earth simplifies the coast and very small units (enclaves, islands). The
  outline is correct at the scale of the whole subcontinent, not for local detail.
