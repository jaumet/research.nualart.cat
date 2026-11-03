# Àfrica esquarterada

Atles interactiu de denúncia sobre com el colonialisme europeu va traçar fronteres sobre els regnes, pobles i cultures d'Àfrica.

Obre `index.html` amb qualsevol navegador (funciona sense connexió i sense servidor).

Té dues versions, que es trien a la barra de dalt de tot de cada pàgina:

- **Versió detallada**, d'estil acadèmic (`detallada.html`): l'atles complet, amb totes les dades, notes i fonts.
- **Versió per a escoles**, d'estil pedagògic (`index.html`, la que s'obre per defecte): la mateixa història explicada pel Baobab, un narrador de més de mil anys, en deu capítols curts amb icones. El mapa canvia sol a mesura que es llegeix (1880 → pobles → Berlín → 1914 → pobles partits → violència → resistència → independències → llengües). Inclou un joc per traçar una frontera amb regle i veure quants pobles parteixes, una animació de les independències (1950–2011), targetes per girar amb els noms antics i nous, preguntes per parlar-ne, un repte de sis preguntes, un petit diccionari i una secció per a mestres. Totes les xifres es calculen amb les mateixes dades que la versió per a adults.

### Llengües

El web és en **català** (l'original) i en **anglès** (`en/index.html` per a escoles i `en/detailed.html` detallada, amb el títol *Africa Carved Up*). Es canvia de llengua a la mateixa barra de dalt. En obrir qualsevol pàgina, `js/lang-redirect.js` mira la llengua principal del navegador: si és català, castellà, portuguès, italià o francès mostra la versió catalana, i si no, l'anglesa. Si la persona tria una llengua a la barra, la tria es desa al navegador i té prioritat.

La versió anglesa porta un avís a dalt de tot. Explica que l'anglès és una de les llengües que va imposar el colonialisme, i que es fa servir per arribar a més gent, també a moltes persones africanes que llegeixen sobretot en la llengua de l'escola. També diu que és una **traducció esborrany**, feta amb l'ajuda d'un agent d'IA i encara sense revisar, i convida a enviar correccions. Quan s'hi afegeixin llengües africanes (la primera, el suahili), aniran abans que les europees al selector.

Per afegir una llengua nova:

1. Copia la carpeta `en/` amb el codi de la llengua (p. ex. `sw/`) i tradueix-ne els textos: les dues pàgines HTML, `js/history.js`, `js/languages.js`, `js/kids.js` (contingut de la versió infantil) i `js/ui.js` (textos de la interfície; la clau és el text català).
2. Afegeix la llengua a `LANGS` dins de `build/check_i18n.js` i executa'l amb `node build/check_i18n.js`. Comprova que la traducció té els mateixos anys, poders i notes que l'original i que no falta cap text de la interfície.
3. Afegeix l'enllaç a la barra de llengües de totes les pàgines.

Quan es corregeixi una dada a l'original català (una data, un poder, una nota), s'ha de fer el mateix canvi a cada traducció; el script avisa si no coincideixen.

## Set vistes

1. **Cronologia (1870–2018)** — animació any per any. Sota, el mapa de regnes i pobles de 1880; a sobre, cada territori es pinta amb el color del poder colonial quan és conquerit i amb color clar quan s'independitza. Les línies discontínues mostren on es traçaran les fronteres futures. El mesurador calcula en directe quina part del continent és sota domini colonial, i 41 esdeveniments (conquesta, resistència, violència, fronteres, independència) s'obren en arribar a cada any.
2. **Abans i després** — comparador amb cortina arrossegable entre quatre mapes estàtics: 1880, 1914, avui i els territoris dels pobles (Murdock, 1959), amb les fronteres actuals superposades.
3. **Pobles partits** — 835 territoris ètnics; en vermell els 230 que tenen almenys un 10% del territori en un segon estat (criteri de Michalopoulos i Papaioannou, 2016). Fes clic en un poble per veure com es reparteix, o compara amb les fronteres de 1914. Inclou 14 històries de divisió (massais, somalis, ewe, bakongo, ioruba, haussa, tuaregs…).
4. **Noms** — noms colonials enfront dels actuals (països i ciutats), amb l'origen de cada nom.
5. **Diversitat lingüística** — llengües vives per estat, percentatge de llengües compartides amb altres estats i famílies (franges proporcionals). Es compta a partir dels països on Glottolog diu que es parla cada llengua, no amb un punt per llengua, perquè un punt no pot representar llengües que travessen fronteres (p. ex. el kikongo, a Angola i als dos Congos). En passar per sobre d'un país se'n veuen les llengües oficials, les nacionals reconegudes i la llista completa, amb les compartides marcades.
6. **Llengües oficials** — llengua de l'administració colonial el 1914 i llengües oficials actuals; les ratlles indiquen diverses llengües oficials. Inclou els canvis recents del Sahel (Mali, Burkina Faso, Níger).
7. **Llengües desaparegudes** — 100 llengües extingides i les quasi extingides, per època, amb històries documentades (ǀxam, kora, nǀuu, kwadi, guanxe, copte, meroític, ongota).

En passar per sobre de qualsevol territori es mostra el nom d'aquell moment, qui el governava i dins de quins estats actuals queda.

## Estructura

```
index.html         versió per a escoles (la que s'obre per defecte)
detallada.html     versió detallada
css/styles.css     estils (versió detallada)
css/infants.css    estils (versió per a escoles)
js/history.js      CONTINGUT HISTÒRIC (editable a mà): sobirania per país i any,
                   noms del 1880 i 1914, esdeveniments, canvis de nom, ciutats, històries
js/languages.js    contingut de les capes de llengües (oficials, 1914, històries, notes)
js/app.js          lògica del mapa (versió detallada)
js/infants.js      mapa, joc i repte de la versió per a escoles
js/infants-content.js  contingut de la versió infantil (històries, fites, targetes, preguntes)
js/i18n.js         traducció de la interfície: tx("text català") → text de la llengua de la pàgina
en/                versió anglesa: index.html (escoles), detailed.html (detallada) i js/ (history, languages, kids, ui)
data/geo.js        geometries projectades (generat, no editar)
data/languages.js  llengües de Glottolog (generat per build/build_languages.py)
build/build.py     genera data/geo.js a partir de build/raw/
build/fetch.sh     torna a descarregar les fonts
build/check_i18n.js  comprova que les traduccions tenen la mateixa estructura que el català
build/og.html, og.sh  imatges per compartir (img/og-*.jpg, 1200×630): ./build/og.sh les torna a generar
```

Per regenerar les dades:

```bash
pip install --user shapely
python3 build/build.py
python3 build/build_languages.py
```

## Verificació i notes

La pàgina inclou una secció **«Notes i incerteses»** (més de 100 notes numerades). Cada data dubtosa, cada xifra de víctimes amb estimacions divergents i cada correcció de les dades d'origen hi té una nota amb la font. Les notes apareixen també als tooltips del mapa i a les fitxes d'esdeveniments.

Correccions fetes a les dades d'origen (historical-basemaps):

- **1914**: el conjunt original intercanviava Somalilàndia britànica i Somàlia italiana i posava el Txad i Ubangui-Xari dins de l'Àfrica Occidental Francesa. El mapa de 1914 s'ha reconstruït agrupant fronteres actuals per unitat colonial, conservant només les peces on la frontera era realment diferent (Kamerun amb el Nou Kamerun, Togolàndia, Jubalàndia, província de Rudolf, zones espanyoles del Marroc).
- **1880**: «Congo» (sota França) era en realitat el regne del Kongo; el Transvaal estava annexionat pel Regne Unit (1877–1881); Lozi i Barotse eren el mateix regne; «Ato» era la confederació aro. S'han afegit avisos on la geometria és dubtosa (regne dendi, Rabih az-Zubayr, extensió de Zanzíbar i de Moçambic).
- **Cronologia**: països com Algèria, el Senegal, Gàmbia, Guinea Equatorial o Sud-àfrica es mostren amb el mapa de 1880 (que conté la petjada colonial real) fins que la reclamació formal cobreix la major part del territori actual.

## Criteris

- Projecció Lambert azimutal d'àrees iguals centrada a l'Àfrica: les àrees i percentatges són comparables.
- La cronologia de sobirania s'ha fet a mà sobre les fronteres actuals perquè el conjunt de dades *historical-basemaps* conté errors greus entre 1900 i 1960 (el 1900 hi és pràcticament igual que el 1880). Les geometries de 1880 i 1914 sí que se'n fan servir, com a mapes estàtics.
- Les dates de conquesta són aproximades: la reclamació formal i el domini efectiu sovint van separats per anys o dècades.
- S'han substituït els exònims pejoratius del mapa de Murdock («Galla», «Hottentot», «Bushmen») per Oromo, Khoikhoi i San, i «Berbers» i el nom àrab «Beraber» per Imazighen (`GROUP_FIX` i `NAME_FIX` a `build/build.py`).

## Fonts i llicències

- Natural Earth, Admin 0 Countries 1:50m — domini públic.
- A. Ourednik, historical-basemaps — GPL-3.0.
- G. P. Murdock (1959), digitalitzat per N. Nunn; reempaquetat per S. Boysel — CC BY-NC-SA 3.0 (ús no comercial).
- Glottolog (Hammarström, Forkel, Haspelmath i Bank, Max Planck Institute for Evolutionary Anthropology) — CC BY 4.0.
- Bibliografia històrica a la secció «Fonts i mètode» de la pàgina.

Les versions anteriors del projecte (`../africa_layers_viewer`, `../africa_quatre_mapes`) es conserven sense canvis.

## Autoria i llicència

Idea original de [Jaume Nu a l'art](https://nualart.cat). Projecte elaborat amb l'ajuda inestimable d'un agent d'IA.

© 2026 · [Creative Commons Reconeixement-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.ca). Les dades de tercers conserven les seves llicències (vegeu «Fonts i llicències»).
