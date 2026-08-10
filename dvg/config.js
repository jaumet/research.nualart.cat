// Configuració central de la web i dels fitxers del llibre.
//
// Producció:
//   Web:     https://research.nualart.cat/dvg/
//   URL:     /area-glotolici/datavisguide/
//   Disc:    /mnt/volume_fra1_01/datavisguide/
//
// La ruta del disc no es pot exposar directament al navegador. El servidor web
// ha de mapar PUBLIC_BOOK_PATH a SERVER_BOOK_PATH (vegeu server-path.example.conf).
const IS_PRODUCTION = window.location.hostname === 'research.nualart.cat';
const LOCAL_BOOK_PATH = 'Data Visualisation Guide/';
const PUBLIC_BOOK_PATH = '/area-glotolici/datavisguide/';

window.DVG_CONFIG = {
  siteBaseUrl: IS_PRODUCTION
    ? 'https://research.nualart.cat/dvg/'
    : './',
  bookBaseUrl: IS_PRODUCTION ? PUBLIC_BOOK_PATH : LOCAL_BOOK_PATH,
  serverBookPath: '/mnt/volume_fra1_01/datavisguide/'
};
