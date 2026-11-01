/*
 * Contingut de la versió per a infants i joves (editable a mà): històries de pobles partits,
 * fites de les independències, targetes de noms i preguntes del repte.
 * La resta de textos són a infants.html; les xifres es calculen a js/infants.js.
 */
window.KIDS = {
  // id i g com a HISTORY.STORIES: nom del mapa de Murdock o, amb g, tot el grup cultural
  STORIES: [
    { id: "Masai", ico: "🐄", label: "Massais", d: "Pastors que viuen amb els seus ramats de vaques a les sabanes. El 1886 i el 1890, britànics i alemanys van traçar una línia recta que els va deixar repartits entre Kenya i Tanzània." },
    { id: "Somali", g: true, ico: "⭐", label: "Somalis", d: "Parlen la mateixa llengua però van quedar repartits en cinc territoris. L'estrella de cinc puntes de la bandera de Somàlia recorda aquests cinc trossos. Avui viuen a Somàlia, Etiòpia, Kenya i Djibouti." },
    { id: "Kongo", ico: "👑", label: "Bakongo", d: "Hereus del gran Regne del Kongo. Portugal, França i el rei Leopold II se'l van repartir. Avui viuen a Angola, la RD del Congo i la República del Congo, i parlen kikongo." },
    { id: "Ewe", ico: "🥁", label: "Ewe", d: "Primer els van separar britànics i alemanys, i després de 1919, britànics i francesos. Avui viuen entre Ghana i Togo." },
    { id: "Tuareg", g: true, ico: "🐪", label: "Tuaregs", d: "Nòmades del desert del Sàhara. Per a ells les fronteres no tenien cap sentit, però ara n'han de travessar moltes. Viuen a Algèria, Líbia, Mali, Níger i Burkina Faso." },
    { id: "Chewa", ico: "🌽", label: "Chewa", d: "Hereus de l'antic Imperi maravi. Un acord entre britànics i portuguesos de 1891 els va repartir entre Malawi, Moçambic i Zàmbia." }
  ],

  // [any, text]: es mostra el text de l'última fita anterior o igual a l'any del control
  MILESTONES: [
    [1950, "El 1950 només uns pocs països africans eren independents. Sud-àfrica no hi compta: hi manava una minoria blanca."],
    [1951, "1951: Líbia es fa independent."],
    [1956, "1956: el Sudan, el Marroc i Tunísia."],
    [1957, "1957: Ghana, amb Kwame Nkrumah, s'independitza i encoratja molts altres pobles."],
    [1958, "1958: Guinea diu «no» a França i s'independitza."],
    [1960, "1960, l'any d'Àfrica: disset països s'independitzen en un sol any! 🎉"],
    [1961, "1961: Sierra Leone i Tanganyika (avui Tanzània)."],
    [1962, "1962: Algèria, després d'una guerra molt dura contra França. També Ruanda, Burundi i Uganda."],
    [1963, "1963: Kenya."],
    [1964, "1964: Malawi i Zàmbia."],
    [1975, "1975: Angola i Moçambic, després de llargues guerres contra Portugal."],
    [1980, "1980: Zimbabwe, que abans es deia Rhodèsia."],
    [1990, "1990: Namíbia."],
    [1993, "1993: Eritrea se separa d'Etiòpia."],
    [1994, "1994: s'acaba l'apartheid i Nelson Mandela és el primer president de Sud-àfrica escollit per tothom. ✊🏿"],
    [2011, "2011: el Sudan del Sud, el país més nou del món."]
  ],

  FLIPS: [
    { old: "Costa d'Or", ico: "🪙", now: "Ghana", y: 1957, why: "Pren el nom d'un imperi africà molt antic, l'Imperi de Ghana." },
    { old: "Sudan Francès", ico: "🇫🇷", now: "Mali", y: 1960, why: "Recorda l'Imperi de Mali, on va regnar Mansa Musa, un rei famós per les seves riqueses." },
    { old: "Rhodèsia", ico: "🎩", now: "Zimbabwe", y: 1980, why: "Vol dir «cases de pedra» en xona. Rhodèsia venia de Cecil Rhodes, un colonitzador britànic." },
    { old: "Alt Volta", ico: "🌊", now: "Burkina Faso", y: 1984, why: "Vol dir «país de les persones íntegres», és a dir, honestes." },
    { old: "Bechuanalàndia", ico: "🏜️", now: "Botswana", y: 1966, why: "«Terra dels tswana», en la seva pròpia llengua." },
    { old: "Niassalàndia", ico: "🏞️", now: "Malawi", y: 1964, why: "Pel nom de l'antic Imperi maravi." },
    { old: "Àfrica del Sud-oest", ico: "🧭", now: "Namíbia", y: 1990, why: "Pel desert del Namib, un dels més antics del món." },
    { old: "Swazilàndia", ico: "🔤", now: "Eswatini", y: 2018, why: "«Terra dels swazi», en siswati, la seva llengua, en lloc d'un nom mig anglès." }
  ],

  // ok = índex de la resposta correcta
  QUIZ: [
    { q: "Quantes persones africanes hi havia a la reunió de Berlín?", a: ["Cap ni una", "Cinc", "Catorze"], ok: 0, why: "Es van repartir l'Àfrica sense preguntar a ningú que hi visqués." },
    { q: "Quins dos països africans eren lliures el 1914?", a: ["Egipte i el Marroc", "Etiòpia i Libèria", "Ghana i Mali"], ok: 1, why: "Etiòpia va guanyar Itàlia a Adwa, el 1896." },
    { q: "Què vol dir «Zimbabwe»?", a: ["Terra del riu", "País lliure", "Cases de pedra"], ok: 2, why: "Ve del xona i recorda la ciutat medieval del Gran Zimbabwe." },
    { q: "Per què el 1960 es diu «l'any d'Àfrica»?", a: ["Perquè disset països es van independitzar", "Perquè es va fer la reunió de Berlín", "Perquè es van dibuixar les fronteres"], ok: 0, why: "En un sol any, disset països africans es van fer independents." },
    { q: "Quantes llengües es parlen a l'Àfrica?", a: ["Unes 50", "Unes 200", "Més de 2.000"], ok: 2, why: "És un dels llocs del món amb més llengües diferents." },
    { q: "Qui era Yaa Asantewaa?", a: ["Una reina mare que va lluitar contra els britànics", "Una exploradora europea", "La primera presidenta de Ghana"], ok: 0, why: "El 1900 va dirigir la guerra per defensar el Tamboret d'Or asante." }
  ]
};
