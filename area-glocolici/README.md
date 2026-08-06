# Glotolici · Area

Visualització exploratòria mundial de les relacions entre gentilicis, glotònims, territoris i llengües. És una adaptació completa del programari Area i funciona íntegrament al navegador, sense dependències externes.

La interfície és disponible en català i anglès. Detecta les preferències lingüístiques del navegador: mostra català quan hi troba una llengua `ca`; altrament, mostra anglès. El selector de la capçalera permet canviar-la manualment.

Cada visualització és reproduïble mitjançant l’URL. Els paràmetres `lang`, `group`, `color`, `sort`, `q`, `continent`, `match` i `certainty` es mantenen sincronitzats amb els controls i permeten compartir una configuració exacta.

## Dades

La font mestra és `../../casos_gentilici_glotonim_ampliat.csv`:

- 428 casos i 35 camps;
- 196 codis de territori i 218 codis de llengua;
- 123 coincidències gentilici–glotònim en català (28,7%) i 305 formes diferents;
- 6 agrupacions continentals i 25 etiquetes de subregió;
- cap camp buit ni identificador repetit;
- 5 repeticions de la parella codi de territori–codi de llengua, conservades com a casos independents.

És un conjunt exploratori: molts valors incorporen les marques `[DUBTOS]` o `[PENDENT]`. La interfície no les elimina de les fitxes; només les neteja en els rètols d’agrupació per evitar categories visualment duplicades. El camp `coincidència_en_llengua_local` és pendent en els 428 casos i, per això, no s’ofereix com a dimensió comparativa.

## Ús

Obriu `index.html`. En un servidor web, aquest fitxer es carrega automàticament quan s’accedeix al directori `area-glocolici/`.

Per regenerar les dades després de modificar el CSV:

```bash
python3 scripts/build_data.py
```

El resultat és `data/glotolici-data.js`. El format JavaScript, en lloc de `fetch()` sobre JSON, permet obrir la visualització directament amb `file://` i també servir-la des de qualsevol servidor web estàtic.
