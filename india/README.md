# Who Drew These Lines?

*Maps of the Indian subcontinent, from Ashoka to today.* A school edition (ages about 10–15), in English,
in the style of [Àfrica esquarterada](../africa_esquarterada/) and [Amèrica esquarterada](../america_esquarterada/).
**First draft written with an AI agent, waiting for review.**

Open `index.html` in any browser. It works offline and without a server: it loads nothing from other sites.

## Languages

English (`index.html`, the default), **Hindi** (`hi/index.html`, *ये रेखाएँ किसने खींचीं?*) and **Punjabi** in
Gurmukhi script (`pa/index.html`, *ਇਹ ਲਕੀਰਾਂ ਕਿਸ ਨੇ ਖਿੱਚੀਆਂ?*). The top bar of every page switches between them.
The Hindi and Punjabi versions are **draft translations made with an AI agent**, not yet reviewed by native
speakers; each page says so at the top. The Punjabi page adds a few lines of Punjab history (Sikh misls,
the annexation of 1849, the Punjabi Suba movement).

- Texts in the HTML are translated in `hi/index.html` and `pa/index.html` (same ids, chapters and controls as
  the English page).
- Texts that the code draws (names of states and kingdoms, notes, legends, milestones, cities, buttons) go
  through `T("English text")` in `js/app.js`; the translations are in `js/lang-hi.js` and `js/lang-pa.js` (key = the English text).
  `python3 tests/i18n_keys.py` lists every key, and the static test fails if one is missing.
- Games, cards and quiz: `js/content-hi.js` and `js/content-pa.js` replace the texts of `js/content.js` and keeps its coordinates
  and keys.
- Devanagari and Gurmukhi use the fonts that come with Windows, macOS, Android and Linux (Noto Sans
  Devanagari/Gurmukhi, Nirmala UI, Raavi, Kohinoor Devanagari, Gurmukhi MN, Mangal), so nothing is downloaded.

To add a language: copy `hi/` and `js/lang-hi.js` / `js/content-hi.js` with the new code, translate them,
add the language to `PAGES` in `tests/browser.py` and to `LANGS` in `tests/check_static.py`, add its fonts to
`css/style.css`, and link it from the top bar of every page.

## The story

One map stays on screen and changes as you read (on phones it sticks to the top). It is told by the
**Banyan**, India's national tree.

| # | Chapter | Map | Interaction |
|---|---|---|---|
| 1 | Ashoka's messages in stone | 250 BCE: Maurya Empire, Kalinga, Magadha, the southern kingdoms named in the edicts; 22 edict sites | Choose a script (Brahmi, Kharosthi, Greek and Aramaic) to see where it was used |
| 2 | The Mughal Empire at its biggest | 1707: Mughal Empire, allies and tribute-payers, Marathas, other kingdoms, European ports | |
| 3 | Many kingdoms, and some traders | 1760: Marathas, Durrani Empire, Nizam, Nawabs, Mysore, Company lands | |
| 4 | How a company took over | 1760, with the European trading posts | Cards: Plassey, the diwani, Mysore, treaties; 1857 |
| 5 | Red and yellow: the British Raj | 1909: provinces and princely states | Game "Red or yellow?" with 8 cities; share of princely states |
| 6 | The line that people rubbed out | Bengal and Eastern Bengal and Assam, 1905–1911 | |
| 7 | The freedom struggle | 11 places from 1824 to 1942 and the Salt March route | Buttons and dots |
| 8 | Freedom, and a painful partition | 1947: India, Pakistan, princely states hatched | |
| 9 | States drawn by language | 1956, coloured by main language (stripes: two languages) | |
| 10 | The map keeps changing | 1956–2026, year by year | Play/slider, with the number of states and union territories |
| 11 | 28 states and 8 union territories | Today | |

Then: *Your place through time* (46 cities: who ruled them on each map), name cards, questions to talk
about, an 8-question quiz, a little dictionary, a section for teachers and the sources.

Every map also has a table version ("Map as a list"). Map labels, dots and colours are explained in the
legend; hovering or tapping shows each name.

## How the maps are made

All maps are cut out of the same land: Natural Earth with the **India point of view**, so the outline of
India is always the official one (Jammu and Kashmir and Ladakh complete, Arunachal Pradesh). See
`LICENSES.md` for the sources and the points to check before publishing in India.

- **250 BCE and 1707** are drawn with simple rules: today's states, hand-drawn shapes in longitude and
  latitude (`build/eras.py`) and their intersections. The Maurya extent follows the edict sites and the
  usual reconstructions (Schwartzberg, Thapar); historians debate how much the empire controlled.
- **1760** uses the colour areas of C. Colbeck's map *India in the time of Clive, 1760* (1884), read
  automatically from a scan (`build/georef.py`), plus rules to split them into states. Corrections to
  Colbeck: Rajput kingdoms, Rohilkhand, Kathiawar, Kutch, the hill kingdoms and the northeast are shown
  apart from the Marathas and the Durranis; the Company lands of 1757–1760 are added.
- **1909** uses the yellow (princely states) and red (British India) areas of the *Imperial Gazetteer of
  India* atlas, read in the same way, and today's states to name the provinces and the main groups of
  princely states. Jammu and Kashmir is drawn with its full extent.
- **1947 onwards** is built from "pieces" of today's map (`eras.pieces`) and a timeline that says which
  state each piece belonged to every year (`eras.TIMELINE`). The hill districts that moved from Punjab to
  Himachal Pradesh in 1966 are an approximate shape. Before 1956 India is drawn as one unit (the Part A,
  B and C states of 1950 are not shown).
- Percentages are measured on these maps in an equal-area projection (Lambert, centred on 80°E 22°N).

To rebuild the data:

```bash
pip install --user -r build/requirements.txt
python3 build/build.py
python3 build/preview.py 1909 /tmp/1909.png   # optional: quick picture of one era
```

## Structure

```
index.html        the page (English)
hi/index.html     the page in Hindi (pa/index.html: Punjabi)
js/lang-hi.js     Hindi for the texts drawn by the code (key: English text); js/lang-pa.js: Punjabi
js/content-hi.js  Hindi for the games, cards and quiz; js/content-pa.js: Punjabi
css/style.css     styles (adapted from Àfrica esquarterada, school edition)
js/content.js     texts of the games, cards and quiz; language colours
js/app.js         map, chapters, games
data/geo.js       all the maps (generated by build/build.py: do not edit)
build/            geo.py (land, states, projection), georef.py (old maps), eras.py (rules), build.py, preview.py,
                  fetch.sh, raw/ (Natural Earth), ref/ (scans of the two old maps)
tests/            check_static.py, browser.py, run.sh
```

## Tests

```bash
bash tests/run.sh                 # static checks + headless Chrome, all three languages, at 1280 and 390 px
python3 tests/browser.py chrome /tmp/shots   # also saves a picture of the map of each chapter
```

The static checks include the official outline (Gilgit, Skardu, Aksai Chin, Muzaffarabad, Mirpur, Srinagar,
Tawang and Itanagar inside India on the 1909 and today's maps). The browser test checks that every chapter
draws its map, the games, the slider counts (14 + 6 in 1956, 25 + 7 in 1987, 29 + 7 in 2014, 28 + 8 today),
no horizontal scroll, no console errors and no requests to other servers. On the translated pages it also fails if
any English word is left in the maps, legends, games or quiz.

## Open questions

- **Review.** The text and the historical maps need review by a historian of South Asia and by teachers in
  India. In particular: the extent of the Maurya Empire, the tributary kingdoms of 1707, the split of 1760,
  the names of the princely-state groups in 1909, and the tone of the Partition chapter.
- **Official map.** Compare the outline with the latest Survey of India political map before publishing in
  India (see `LICENSES.md`).
- **Hindi and Punjabi review** by native speakers, especially historical terms and the Devanagari spelling of names
  (Ashokan sites, kingdoms, princely states). A Shahmukhi Punjabi page could be added for readers in Pakistan. Then other Indian
  languages, and a Catalan version like the sister atlases.
- **More maps** that could be added: Delhi Sultanate (1330), Vijayanagara (1520), Company territories in
  1805 and 1857, the Part A/B/C states of 1950.
- **Detailed edition** with notes for every date, like *Àfrica esquarterada*.

## Credits

Original idea by [Jaume Nu a l'art](https://nualart.cat). Made with the invaluable help of an AI agent.
© 2026 · [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Third-party data keep their
own licences (see `LICENSES.md`).
