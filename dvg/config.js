// Configuració central de la web i dels fitxers del llibre.
//
// Producció:
//   Web:     https://research.nualart.cat/dvg/
//   Media:   https://media.nualart.cat/datavisguide/
//   Disc:    /mnt/volume_fra1_01/datavisguide/
//
// La ruta del disc no es pot exposar directament al navegador. El servidor web
// de media ha de mapar PRODUCTION_BOOK_URL a SERVER_BOOK_PATH
// (vegeu server-path.example.conf).
const IS_PRODUCTION = window.location.hostname === 'research.nualart.cat';
const LOCAL_BOOK_PATH = 'Data Visualisation Guide/';
const PRODUCTION_BOOK_URL = 'https://media.nualart.cat/datavisguide/';

window.DVG_CONFIG = {
  siteBaseUrl: IS_PRODUCTION
    ? 'https://research.nualart.cat/dvg/'
    : './',
  bookBaseUrl: IS_PRODUCTION ? PRODUCTION_BOOK_URL : LOCAL_BOOK_PATH,
  serverBookPath: '/mnt/volume_fra1_01/datavisguide/'
};
