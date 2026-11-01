/*
 * Contingut de les capes de llengües (editable a mà).
 * Les dades de cada llengua (punts) són a data/languages.js, generat des de Glottolog.
 * Les notes s'afegeixen al final de HISTORY.NOTES perquè es numerin a continuació.
 */
window.LANGINFO = (() => {
  // Categories per a les llengües oficials i d'administració
  const CATS = {
    AFR: { name: "llengües africanes", color: "#e3b23c" },
    AR:  { name: "àrab", color: "#a8738f" },
    FR:  { name: "francès", color: "#3d6cb3" },
    EN:  { name: "anglès", color: "#c23b32" },
    PT:  { name: "portuguès", color: "#2f8a5b" },
    ES:  { name: "castellà", color: "#e0892d" },
    DE:  { name: "alemany", color: "#5a5a5a" },
    IT:  { name: "italià", color: "#3a9a9a" },
    NL:  { name: "neerlandès", color: "#d36b8a" },
    AK:  { name: "afrikaans", color: "#7d1d3f" },
    CR:  { name: "crioll d'origen colonial", color: "#6fc2b0" }
  };

  // [nom, categoria, rol] · rol: "o" oficial (per defecte) · "t" llengua de treball
  const L = (...rows) => rows;
  const NOW = {
    DZA: { l: L(["àrab", "AR"], ["amazic (tamazight)", "AFR"]) },
    AGO: { l: L(["portuguès", "PT"]) },
    BEN: { l: L(["francès", "FR"]) },
    BWA: { l: L(["anglès", "EN"]), n: ["lnational"] },
    BFA: { l: L(["llengües nacionals", "AFR"], ["francès", "FR", "t"], ["anglès", "EN", "t"]), n: ["lsahel"] },
    BDI: { l: L(["kirundi", "AFR"], ["francès", "FR"], ["anglès", "EN"]) },
    CMR: { l: L(["francès", "FR"], ["anglès", "EN"]) },
    CPV: { l: L(["portuguès", "PT"]), n: ["lnational"] },
    CAF: { l: L(["francès", "FR"], ["sango", "AFR"]) },
    TCD: { l: L(["francès", "FR"], ["àrab", "AR"]) },
    COM: { l: L(["comorià", "AFR"], ["francès", "FR"], ["àrab", "AR"]) },
    COG: { l: L(["francès", "FR"]), n: ["lnational"] },
    COD: { l: L(["francès", "FR"]), n: ["lnational"] },
    CIV: { l: L(["francès", "FR"]) },
    DJI: { l: L(["francès", "FR"], ["àrab", "AR"]) },
    EGY: { l: L(["àrab", "AR"]) },
    GNQ: { l: L(["castellà", "ES"], ["francès", "FR"], ["portuguès", "PT"]) },
    ERI: { l: L(["tigrinya", "AFR", "t"], ["àrab", "AR", "t"], ["anglès", "EN", "t"]), n: ["leri"] },
    SWZ: { l: L(["siswati", "AFR"], ["anglès", "EN"]) },
    ETH: { l: L(["amhàric, oromo, tigrinya, somali i àfar", "AFR", "t"]), n: ["leth"] },
    GAB: { l: L(["francès", "FR"]) },
    GMB: { l: L(["anglès", "EN"]) },
    GHA: { l: L(["anglès", "EN"]) },
    GIN: { l: L(["francès", "FR"]) },
    GNB: { l: L(["portuguès", "PT"]) },
    KEN: { l: L(["swahili", "AFR"], ["anglès", "EN"]) },
    LSO: { l: L(["sesotho", "AFR"], ["anglès", "EN"]) },
    LBR: { l: L(["anglès", "EN"]) },
    LBY: { l: L(["àrab", "AR"]) },
    MDG: { l: L(["malgaix", "AFR"], ["francès", "FR"]) },
    MWI: { l: L(["anglès", "EN"]), n: ["lnational"] },
    MLI: { l: L(["13 llengües nacionals", "AFR"], ["francès", "FR", "t"]), n: ["lsahel"] },
    MRT: { l: L(["àrab", "AR"]) },
    MUS: { l: L(["anglès", "EN", "t"], ["francès", "FR", "t"]), n: ["lmus"] },
    MAR: { l: L(["àrab", "AR"], ["amazic (tamazight)", "AFR"]) },
    MOZ: { l: L(["portuguès", "PT"]) },
    NAM: { l: L(["anglès", "EN"]) },
    NER: { l: L(["haussa (llengua nacional)", "AFR"], ["francès", "FR", "t"], ["anglès", "EN", "t"]), n: ["lsahel"] },
    NGA: { l: L(["anglès", "EN"]) },
    RWA: { l: L(["kinyarwanda", "AFR"], ["francès", "FR"], ["anglès", "EN"], ["swahili", "AFR"]) },
    STP: { l: L(["portuguès", "PT"]) },
    SEN: { l: L(["francès", "FR"]), n: ["lnational"] },
    SYC: { l: L(["crioll seychellès", "CR"], ["anglès", "EN"], ["francès", "FR"]) },
    SLE: { l: L(["anglès", "EN"]) },
    SOM: { l: L(["somali", "AFR"], ["àrab", "AR"]) },
    SOL: { l: L(["somali", "AFR"], ["àrab", "AR"], ["anglès", "EN"]) },
    ZAF: { l: L(["9 llengües africanes", "AFR"], ["anglès", "EN"], ["afrikaans", "AK"]), n: ["lzaf"] },
    SDN: { l: L(["àrab", "AR"], ["anglès", "EN"]) },
    SDS: { l: L(["anglès", "EN"]) },
    TZA: { l: L(["swahili", "AFR"], ["anglès", "EN"]) },
    TGO: { l: L(["francès", "FR"]) },
    TUN: { l: L(["àrab", "AR"]) },
    UGA: { l: L(["anglès", "EN"], ["swahili", "AFR"]) },
    SAH: { l: L(["àrab", "AR"]), n: ["lsah"] },
    ZMB: { l: L(["anglès", "EN"]) },
    ZWE: { l: L(["14 llengües africanes", "AFR"], ["anglès", "EN"]), n: ["lzwe"] }
  };

  // Llengües nacionals o reconegudes (sense ser oficials), segons la llista de Viquipèdia
  // «List of official languages by country and territory» (consultada el novembre de 2026)
  const NATIONAL = {
    AGO: "kimbundu, umbundu, kikongo, chokwe, kwanyama, ganguela",
    BWA: "setswana (nacional)",
    CPV: "crioll capverdià",
    CMR: "llengües regionals (grassfields, beti, fulfulde, haussa…)",
    COD: "kikongo (kituba), lingala, swahili, tshiluba",
    COG: "lingala, munukutuba (kituba)",
    GMB: "mandinka, pulaar, wòlof, serer, jola, balanta, soninke",
    GHA: "fante, twi, ewe, ga i altres llengües regionals",
    GIN: "fula, maninka, susu",
    MWI: "chichewa",
    MRT: "pulaar, soninke, wòlof",
    NAM: "afrikaans, alemany, oshiwambo (regionals)",
    NER: "àrab, fulfulde, gulmancema, kanuri, zarma, tamazight",
    NGA: "haussa, ioruba, igbo",
    SEN: "jola-fogny, mandinka, pulaar, serer, soninke, wòlof",
    SLE: "krio",
    SDS: "bari, dinka, luo, murle, nuer, zande i unes 60 més",
    ETH: "llengües regionals (benshangul, gumuz, harari, kunama, sidamo…)"
  };

  // Llengua de l'administració colonial cap al 1914 (unitats de GEO.p1914)
  const Y1914 = {
    "Morocco": L(["francès", "FR"], ["àrab", "AR"]), "Spanish Morocco": L(["castellà", "ES"], ["àrab", "AR"]), "Spanish Sahara": L(["castellà", "ES"]),
    "Algeria": L(["francès", "FR"]), "Tunisia": L(["francès", "FR"], ["àrab", "AR"]), "Libya": L(["italià", "IT"]),
    "Egypt": L(["àrab", "AR"], ["anglès", "EN"]), "Anglo-Egyptian Sudan": L(["anglès", "EN"], ["àrab", "AR"]),
    "Eritrea": L(["italià", "IT"]), "Abyssinia": L(["amhàric", "AFR"]), "Djibouti": L(["francès", "FR"]),
    "British Somaliland": L(["anglès", "EN"]), "Italian Somaliland": L(["italià", "IT"]),
    "British East Africa": L(["anglès", "EN"]), "Uganda": L(["anglès", "EN"]),
    "German East Africa": L(["alemany", "DE"], ["swahili", "AFR"]),
    "Belgian Congo": L(["francès", "FR"]), "Angola": L(["portuguès", "PT"]), "Mozambique": L(["portuguès", "PT"]),
    "Nyasaland": L(["anglès", "EN"]), "Rhodesia": L(["anglès", "EN"]), "Bechuanaland": L(["anglès", "EN"]),
    "German South-West Africa": L(["alemany", "DE"]), "Union of South Africa": L(["anglès", "EN"], ["neerlandès", "NL"]),
    "Basutoland": L(["anglès", "EN"]), "Swaziland": L(["anglès", "EN"]), "Madagascar": L(["francès", "FR"]),
    "Kamerun": L(["alemany", "DE"]), "French Equatorial Africa": L(["francès", "FR"]), "Nigeria": L(["anglès", "EN"]),
    "French West Africa": L(["francès", "FR"]), "Togoland": L(["alemany", "DE"]), "Gold Coast": L(["anglès", "EN"]),
    "Gambia": L(["anglès", "EN"]), "Portuguese Guinea": L(["portuguès", "PT"]), "Sierra Leone": L(["anglès", "EN"]),
    "Liberia": L(["anglès", "EN"]), "Spanish Guinea": L(["castellà", "ES"]), "Cape Verde": L(["portuguès", "PT"]),
    "Sao Tome": L(["portuguès", "PT"]), "Mauritius": L(["anglès", "EN"]), "Seychelles": L(["anglès", "EN"])
  };
  const Y1914_NOTES = { "German East Africa": ["l1914"], "Union of South Africa": ["l1914za"], "Liberia": ["lbr"], "Abyssinia": ["eth"] };

  // Grups de famílies (vegeu build/build_languages.py)
  const GROUPS = {
    ac: { name: "Atlàntic-Congo (inclou les bantu)", color: "#4fae63" },
    nc: { name: "Mande, kru, dogon, ijo", color: "#a7d36a" },
    aa: { name: "Afroasiàtica (àrab, amazic, haussa, somali…)", color: "#e8a23c" },
    ns: { name: "Nilòtiques, sudàniques i saharianes («nilo-saharianes»)", color: "#a27bd6" },
    ks: { name: "Khoe, tuu, kxa, hadza, sandawe («khoisan»)", color: "#ec6a98" },
    an: { name: "Austronèsia (malgaix)", color: "#4cb3e6" },
    co: { name: "Llengües de contacte (criolls, pidgins, afrikaans)", color: "#f1f1f1" },
    ot: { name: "Altres famílies i llengües aïllades", color: "#8d8d8d" }
  };
  const AES = {
    0: { name: "estat desconegut", color: "#6f6a64" },
    1: { name: "no amenaçada", color: "#5f7f66" },
    2: { name: "vulnerable", color: "#d8c35a" },
    3: { name: "en perill", color: "#e39b3a" },
    4: { name: "molt amenaçada", color: "#e0662f" },
    5: { name: "quasi extingida", color: "#d0352b" },
    6: { name: "extingida", color: "#111111" }
  };

  // Històries de llengües desaparegudes o a punt de desaparèixer (nom tal com és a Glottolog)
  const STORIES = [
    { id: "/Xam", label: "ǀxam", n: ["s_xam"], d: "Llengua dels san de l'interior del Cap. Les milícies colonials dels segles XVIII i XIX van exterminar o esclavitzar gran part dels seus parlants. Entre 1870 i 1884, Wilhelm Bleek i Lucy Lloyd en van recollir milers de pàgines de presoners ǀxam del penal de Breakwater, a Ciutat del Cap. El lema de l'escut de Sud-àfrica (2000), «!ke e: ǀxarra ǁke», està escrit en ǀxam: una llengua que ja ningú no parla." },
    { id: "Korana", label: "Kora (!ora)", n: ["s_kora"], d: "Llengua khoekhoe del Cap i del riu Gariep (Orange). La pèrdua de terres i el domini colonial van imposar el neerlandès i després l'afrikaans; els darrers parlants fluents van morir cap a finals del segle XX. Avui hi ha iniciatives per recuperar-la." },
    { id: "N||ng", label: "Nǀuu", n: ["s_nuu"], d: "Llengua tuu del Kalahari sud-africà. Es considerava extingida fins que als anys noranta es van trobar alguns parlants d'edat avançada; avui en queden molt pocs. Els ǂkhomani van ser expulsats de les seves terres quan es va crear el parc nacional Kalahari Gemsbok (1931), i molts van haver d'amagar la seva identitat i la seva llengua." },
    { id: "Kwadi", label: "Kwadi", n: ["s_kwadi"], d: "Llengua d'un poble de pastors i caçadors del sud-oest d'Angola, emparentada llunyanament amb les llengües khoe. Es va documentar poc i tard; es considera extingida." },
    { id: "Guanche", label: "Guanxe", n: ["s_guanche"], d: "Llengua dels antics habitants de les illes Canàries, probablement emparentada amb les llengües amazigues (berbers). La conquesta castellana (1402–1496), l'esclavització i les epidèmies en van eliminar els parlants; al segle XVII ja no es parlava. En queden topònims, algunes paraules i inscripcions. És un dels primers casos de colonització europea a l'Àfrica." },
    { id: "Coptic", label: "Copte", n: ["s_copt"], d: "Darrera etapa de la llengua dels antics egipcis. Després de la conquesta àrab (639–642) va ser substituïda progressivament per l'àrab; es va deixar de parlar entre els segles XVI i XVII i avui és la llengua litúrgica de l'Església copta. La substitució lingüística no va començar amb el colonialisme europeu." },
    { id: "Meroitic", label: "Meroític", n: ["s_mero"], d: "Llengua del regne de Kush en l'etapa en què la capital era Meroe (aprox. segle III aC – segle IV dC); segles abans, els reis kushites havien governat Egipte com a XXV dinastia. Se'n pot llegir l'escriptura, però la llengua encara s'entén molt parcialment. Es va extingir cap al segle IV." },
    { id: "Ongota", label: "Ongota", n: ["s_ongota"], d: "Llengua del sud d'Etiòpia que només conserven unes poques persones grans; la comunitat ha adoptat el ts'amakko, una llengua veïna. La pressió sobre les llengües petites també ve de llengües africanes més grans." }
  ];

  const NOTES = {
    lpoints: "Glottolog situa cada llengua amb un sol punt al centre aproximat de la seva àrea, i en llista els països on es parla. Un punt no pot representar una llengua estesa per diversos països (el kikongo, el swahili, l'haussa…): per això la diversitat es compta per països i no amb punts, que només es fan servir per a les llengües extingides o en perill, sovint molt localitzades. Les llengües no tenen fronteres nítides: comparteixen territori, se superposen, i la majoria de persones a l'Àfrica en parlen dues o més. Font: H. Hammarström, R. Forkel, M. Haspelmath i S. Bank, <i>Glottolog</i> (Max Planck Institute for Evolutionary Anthropology), CC BY 4.0. S'hi inclouen les llengües parlades com a primera llengua i els pidgins; no s'hi inclouen les llengües de signes.",
    lcountries: "Recompte a partir de la llista de països on Glottolog indica que es parla cada llengua viva: una llengua que es parla a Angola, la RD del Congo i el Congo compta en tots tres. Glottolog distingeix varietats que sovint es consideren una sola llengua (per exemple, el kikongo hi apareix com a sankongo, koongo central i yombe), de manera que els recomptes són orientatius. Glottolog no dona el nombre de parlants: un recompte alt no vol dir més població.",
    lnationalsrc: "Llengües nacionals o reconegudes: Viquipèdia, «List of official languages by country and territory» (consultada el novembre de 2026), que remet a les constitucions i lleis de cada estat.",
    lgroups: "Agrupació de famílies per facilitar la lectura. Glottolog només accepta famílies demostrades (atlàntic-congo, afroasiàtica, mande, nilòtica, etc.). «Níger-congo» en sentit ampli, «nilo-sahariana» i «khoisan» són hipòtesis o agrupacions de J. Greenberg (1963) que molts lingüistes no consideren famílies genètiques.",
    lcontact: "«Llengües de contacte»: criolls i pidgins. La majoria van néixer del comerç, l'esclavitud i la colonització europea (krio, crioll capverdià, pidgin nigerià, crioll seychellès…), igual que l'afrikaans, derivat del neerlandès; uns quants tenen altres orígens (pidgins de base àrab o pidgins recents d'obres públiques). Glottolog classifica els criolls de base europea dins de la família indoeuropea. Molts són avui llengües africanes de ple dret, parlades per milions de persones.",
    lextinct: "Glottolog dona l'any de la darrera documentació coneguda, que no coincideix necessàriament amb la data d'extinció. Les causes de desaparició són diverses: violència i despossessió colonial (llengües san i khoekhoe del sud), però també substitució per llengües africanes majoritàries (haussa, amhàric, swahili…), urbanització i, en el cas de les llengües antigues, processos de fa segles.",
    lstatus: "Estat de vitalitat segons l'<i>Agglomerated Endangerment Status</i> de Glottolog, que combina les escales EGIDS (Ethnologue), UNESCO i ElCat.",
    loff: "Llengües oficials segons les constitucions vigents el 2026. L'estatus oficial no reflecteix l'ús real: en molts estats francòfons o anglòfons només una minoria parla amb fluïdesa la llengua oficial, mentre que les llengües africanes vehiculars (wolof, bambara, lingala, swahili, haussa…) són les més parlades.",
    lnational: "En molts estats (el Senegal, Botswana, Malawi, la RD del Congo, Cap Verd…) les llengües africanes tenen reconeixement com a «nacionals», però l'única llengua oficial continua sent l'europea.",
    lsahel: "Constitució de Mali (2023), revisió constitucional de Burkina Faso (desembre de 2023, promulgada el gener de 2024) i Carta de la Refundació del Níger (març de 2025): les llengües nacionals passen a ser oficials (al Níger, l'haussa és declarada «llengua nacional») i el francès queda com a «llengua de treball», al costat de l'anglès a Burkina Faso i al Níger. A la pràctica, el francès continua dominant l'administració i l'ensenyament superior.",
    leth: "El febrer de 2020 el Consell de Ministres va anunciar l'afaan oromo, el tigrinya, el somali i l'àfar com a llengües de treball federals al costat de l'amhàric; la implementació és gradual.",
    leri: "Eritrea no té cap llengua oficial de iure; el tigrinya, l'àrab i l'anglès s'utilitzen com a llengües de treball.",
    lmus: "Maurici no té cap llengua oficial de iure; l'anglès i el francès s'utilitzen al parlament i a l'administració, però la llengua més parlada és el crioll mauricià.",
    lzaf: "Sud-àfrica té 12 llengües oficials: 9 llengües africanes (zulu, xhosa, sepedi, setswana, sesotho, xitsonga, siswati, tshivenda i isiNdebele), l'anglès, l'afrikaans i, des del 2023, la llengua de signes sud-africana.",
    lzwe: "La constitució de Zimbabwe (2013) reconeix 16 llengües oficials, entre les quals l'anglès, el xona, el ndebele i la llengua de signes.",
    lsah: "Al territori administrat pel Marroc s'apliquen l'àrab i l'amazic; la República Àrab Sahrauí Democràtica té l'àrab com a llengua oficial i fa servir també el castellà.",
    l1914gen: "Llengua de l'administració colonial cap al 1914. A la pràctica, moltes administracions també feien servir llengües africanes vehiculars: l'haussa al nord de Nigèria (administració indirecta), el lingala i el kikongo a l'exèrcit i l'administració del Congo, el wolof al Senegal. L'escolarització en la llengua europea arribava a una minoria molt petita.",
    l1914: "L'administració alemanya de l'Àfrica Oriental va fer servir àmpliament el swahili, cosa que en va afavorir l'expansió per tot el territori.",
    l1914za: "La constitució de la Unió Sud-africana (1910) feia oficials l'anglès i el neerlandès; l'afrikaans va substituir el neerlandès el 1925. Cap llengua africana no era oficial.",
    s_xam: "Fonts: col·lecció Bleek i Lloyd (Universitat de Ciutat del Cap; Registre de la Memòria del Món de la UNESCO, 1997); P. Skotnes, <i>Claim to the Country</i> (2007); M. Adhikari, <i>The Anatomy of a South African Genocide</i> (2010).",
    s_kora: "Glottolog en situa la darrera documentació el 1985; la data de mort dels darrers parlants no és precisa. Font: M. du Plessis, <i>Kora: A Lost Khoisan Language of the Early Cape and the Gariep</i> (2018).",
    s_nuu: "Glottolog la classifica com a «quasi extingida». La comunitat ǂkhomani va guanyar una reclamació de terres el 1999. El nombre exacte de parlants vius varia segons les fonts i ha disminuït ràpidament.",
    s_kwadi: "Glottolog en situa la darrera documentació cap al 1975. Les dades sobre els darrers parlants són escasses i la data d'extinció és incerta.",
    s_guanche: "Glottolog en situa la documentació entre 1341 i 1650. El coneixement de la llengua és molt fragmentari.",
    s_copt: "Glottolog en situa l'ús entre els segles III i XVII. La data exacta en què va deixar de ser llengua materna és discutida.",
    s_mero: "L'escriptura meroítica va ser desxifrada fonèticament per F. Ll. Griffith (1909–1911), però el lèxic i la gramàtica només s'entenen parcialment.",
    s_ongota: "Glottolog la classifica com a «quasi extingida»; la seva classificació genètica és discutida."
  };
  Object.assign(window.HISTORY.NOTES, NOTES);

  // Noms habituals de varietats que Glottolog separa (es mostren entre parèntesis)
  const ALIAS = {
    "San Salvador Kongo": "kikongo", "South-Central Koongo": "kikongo", "Yombe": "kikongo", "Suundi": "kikongo", "Laari": "kikongo",
    "Kituba (Congo)": "kikongo", "Kituba (Democratic Republic of Congo)": "kikongo", "Kinshasa Lingala": "lingala", "Northwestern Lingala": "lingala"
  };

  return { ALIAS, NATIONAL, CATS, NOW, Y1914, Y1914_NOTES, GROUPS, AES, STORIES };
})();
