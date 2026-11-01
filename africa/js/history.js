/*
 * Contingut històric d'«Àfrica esquarterada».
 * Aquest fitxer és editable a mà: no depèn del procés de construcció de dades.
 *
 * Criteris:
 *  - Cada fila de cronologia és [any, poder, nom en aquell moment, [notes]].
 *  - L'any és el de la reclamació formal (tractat, protectorat, proclamació) sobre la
 *    major part del territori actual. Mentre no hi ha reclamació formal sobre la major
 *    part del territori, el país es marca "PRE" i es veu el mapa de 1880 a sota (amb la
 *    petjada colonial real d'aquell moment, p. ex. el nord d'Algèria).
 *  - Les xifres de víctimes són estimacions; quan les fonts divergeixen es dona un
 *    interval i una nota amb les fonts.
 *  - Tot el que és dubtós o aproximat porta una nota (NOTES).
 */
window.HISTORY = (() => {
  // ---------------------------------------------------------------- Poders
  const POWERS = {
    PRE: { name: "Abans de la conquesta (vegeu el mapa de 1880)", short: "Pre-colonial", color: null },
    AF:  { name: "Estat africà independent", short: "Africà independent", color: "#e3b23c" },
    FR:  { name: "França", short: "França", color: "#3d6cb3" },
    GB:  { name: "Regne Unit", short: "Regne Unit", color: "#c23b32" },
    PT:  { name: "Portugal", short: "Portugal", color: "#2f8a5b" },
    BE:  { name: "Bèlgica", short: "Bèlgica", color: "#8a5bb0" },
    LEO: { name: "Leopold II (propietat privada)", short: "Leopold II", color: "#4b2566" },
    DE:  { name: "Alemanya", short: "Alemanya", color: "#4a4a4a" },
    IT:  { name: "Itàlia", short: "Itàlia", color: "#3a9a9a" },
    ES:  { name: "Espanya", short: "Espanya", color: "#e0892d" },
    OT:  { name: "Imperi otomà / Egipte", short: "Otomans / Egipte", color: "#a8738f" },
    SET: { name: "Règim de minoria blanca", short: "Minoria blanca", color: "#7d1d3f" },
    OCC: { name: "Ocupació per un estat veí", short: "Ocupació", color: "#6c7a35" },
    IND: { name: "Independent (postcolonial)", short: "Independent", color: "#efe0bb" }
  };
  const COLONIAL = new Set(["FR", "GB", "PT", "BE", "LEO", "DE", "IT", "ES", "SET"]);

  // ---------------------------------------------------------------- Notes i fonts
  // Es numeren automàticament en l'ordre en què apareixen aquí.
  const NOTES = {
    // Generals
    claim: "Les dates de la cronologia són les de la reclamació formal (tractat, protectorat o proclamació) sobre la major part del territori. El domini efectiu de l'interior sovint va arribar anys o dècades més tard, després de guerres de conquesta. Fonts: H. L. Wesseling, <i>Divide and Rule: The Partition of Africa 1880–1914</i> (1996); I. Brownlie, <i>African Boundaries: A Legal and Diplomatic Encyclopaedia</i> (1979).",
    modern: "La cronologia es dibuixa sobre les fronteres actuals, que en gran part coincideixen amb les colonials. És una aproximació: algunes fronteres colonials van canviar més tard (Kamerun i Togolàndia el 1919, Jubalàndia el 1925, la província de Rudolf el 1926, els límits de Líbia el 1925–1935, entre d'altres).",
    base1880: "El mapa de base prové del conjunt <i>historical-basemaps</i> (A. Ourednik), any 1880, i es fa servir per a tot el període 1870–1900. Algunes entitats no existien el 1870 (p. ex. l'imperi de Wassoulou, fundat el 1878) i moltes fronteres són molt aproximades. S'hi han corregit diversos errors (vegeu les notes de cada entitat).",
    hatch: "Les zones ratllades no estan representades al conjunt de dades. Hi ha societats sense estat centralitzat, però també entitats polítiques omeses (sultanats somalis de Majeerteen i Hobyo, sultanat d'Aussa, regne bamum, imperi de Gaza, regnes bemba, entre d'altres). No eren «terra de ningú».",
    map1914: "El mapa de 1914 s'ha reconstruït agrupant les fronteres actuals per unitat colonial, perquè el conjunt de dades original tenia errors greus (Somalilàndia britànica i italiana intercanviades; el Txad i Ubangui-Xari inclosos a l'Àfrica Occidental Francesa). Només se n'han conservat les peces on la frontera de 1914 era diferent de l'actual: el Kamerun amb el Nou Kamerun, la Togolàndia sencera, Jubalàndia (britànica fins al 1925) i la província de Rudolf (ugandesa fins al 1926).",
    murdock: "El mapa de G. P. Murdock (1959), digitalitzat per N. Nunn, simplifica i fixa categories ètniques que eren fluides, i algunes són construccions colonials. Els límits són aproximats. Serveix per mesurar ordres de magnitud de la partició, no per delimitar pobles amb precisió. Criteri de partició (≥10% del territori en un segon estat): S. Michalopoulos i E. Papaioannou, «The Long-Run Effects of the Scramble for Africa», <i>American Economic Review</i> 106/7 (2016).",
    share: "Percentatge calculat sobre les fronteres actuals en projecció d'àrees iguals. Abans de cada conquesta formal es compta la petjada colonial europea que mostra el mapa de 1880. El domini otomà i egipci (Egipte, Sudan, Líbia, Tunísia) i les ocupacions per estats veïns (Eritrea per Etiòpia, Sàhara Occidental pel Marroc) es compten a part.",
    set: "«Règim de minoria blanca»: estats o colònies governats per una minoria d'origen europeu, amb autonomia respecte de la metròpoli, que excloïen la majoria africana del poder (repúbliques bòers, Unió Sud-africana, Rhodèsia del Sud, ocupació sud-africana de Namíbia).",

    // Mapa de 1880
    kongo: "El conjunt de dades etiqueta aquest territori com a «Congo» sota sobirania francesa, però per la seva localització (nord d'Angola, al voltant de Mbanza Kongo) correspon al regne del Kongo, formalment independent però sota forta influència portuguesa. S'ha corregit.",
    lozi: "El conjunt de dades separa «Lozi» i «Barotse», però són el mateix regne (Barotselàndia). S'han unit.",
    transvaal: "El Transvaal (República Sud-africana) va ser annexionat pel Regne Unit entre l'abril de 1877 i l'agost de 1881. El conjunt de dades el presenta com a república bòer; s'ha corregit.",
    dendi: "La localització del regne dendi en aquest conjunt de dades és dubtosa: el regne dendi, successor del Songhai, se situava al llarg del riu Níger, al sud-oest de l'actual Níger i al nord de Benín, i no a l'actual Mali.",
    rabih: "Rabih az-Zubayr va abandonar el Bahr el-Ghazal el 1879 i no va tenir un estat territorial estable fins als anys 1890 (conquesta de Bornu, 1893). La seva representació el 1880 és anacrònica.",
    zanzibar: "L'extensió del sultanat de Zanzíbar és exagerada: la seva sobirania reconeguda es limitava a les illes i a una franja costanera; a l'interior tenia sobretot influència comercial (rutes de caravanes).",
    moz1880: "L'extensió de Moçambic portuguès el 1880 és exagerada: el control efectiu es limitava a alguns punts de la costa i a la vall del Zambeze (prazos). Hi manca l'imperi de Gaza, que dominava el sud fins al 1895.",
    liberia1880: "El 1880 Libèria reclamava la regió de Gallinas, que va cedir a Sierra Leone el 1885.",
    pguinea1880: "Fins al 1886 la Casamança (Ziguinchor) era portuguesa; passà a França per la convenció franco-portuguesa d'aquell any.",
    shona: "Els xona no formaven un sol estat el 1880: el conjunt de dades agrupa diversos territoris i cacicats.",
    egypt: "Egipte era un khedivat autònom sota sobirania nominal otomana. Havia conquerit el Sudan entre 1820 i 1874, i Harar i la costa somali el 1875; amb oficials europeus al seu servei, era un poder africà però també imperial.",
    ot: "Tunísia (beylicat) i Egipte (khedivat) tenien una gran autonomia sota una sobirania otomana nominal. Tripolitània i Cirenaica eren administrades directament per Istanbul.",

    // Països
    dza: "Alger va ser ocupada el 1830. El nord d'Algèria es va conquerir entre 1830 i 1857 (Abd el-Kader es rendí el 1847; la Cabília, el 1857). El Sàhara va ser ocupat entre 1899 i 1902 (Tuat, In Salah) i la resistència tuareg va continuar fins al 1916–17. Fins al 1900 el mapa mostra la part francesa amb la geometria de 1880.",
    sen: "Saint-Louis era francesa des del 1659. La conquesta de l'interior (Kayor, 1886; Djolof, 1890) i la fixació de les fronteres amb la Guinea Portuguesa (1886) i Gàmbia (1889) són posteriors. Fins al 1886 el mapa mostra la part francesa amb la geometria de 1880.",
    gmb: "Bathurst (Banjul) era britànica des del 1816. Les fronteres es van fixar per l'acord anglo-francès de 1889 i l'interior es declarà protectorat el 1894.",
    zaf: "La colònia del Cap (britànica des del 1806) i Natal (1843) coexistien amb les repúbliques bòers i amb regnes africans (zulu i pedi fins al 1879). Tot el territori va quedar sota domini britànic després de la guerra de 1899–1902. Fins aleshores el mapa mostra la geometria de 1880.",
    zaf1910: "La Unió Sud-africana (1910) era un domini autogovernat de l'Imperi britànic, amb sobirania plena des de l'Estatut de Westminster (1931), però la majoria negra no hi tenia drets polítics.",
    angmoz: "Portugal era present a la costa des dels segles XV–XVI, però el seu domini de l'interior va ser molt limitat fins a les campanyes de 1890–1920 (imperi de Gaza, 1895; Kwanyama, 1915; Barue, 1917). L'any 1891 correspon al tractat anglo-portuguès que en fixà les fronteres.",
    islands: "Arxipèlag deshabitat abans de l'arribada dels europeus, poblat sobretot per persones africanes esclavitzades (i, a Maurici i les Seychelles, també per treballadors contractats de l'Índia).",
    gnq: "Espanya obtingué Fernando Póo per tractat el 1778, però no l'ocupà efectivament fins al 1843. El territori continental (Río Muni) li va ser reconegut pel tractat de París de 1900.",
    gnb: "Colònia separada de Cap Verd el 1879. L'interior es va conquerir el 1912–1915 i les illes Bijagós no es van sotmetre fins al 1936. La independència es proclamà unilateralment el 24 de setembre de 1973; Portugal la reconegué el setembre de 1974.",
    sle: "Freetown era colònia britànica des del 1808; l'interior va ser declarat protectorat el 1896 (guerra de l'impost de les cabanes, 1898).",
    lso: "Protectorat britànic des del 1868; administrat per la colònia del Cap entre 1871 i 1884.",
    com: "Maiotte era francesa des del 1841; la resta de l'arxipèlag fou protectorat el 1886 i annexionat el 1912. Maiotte continua sent francesa, malgrat les resolucions de l'ONU.",
    cod: "Leopold II va proclamar l'Estat Lliure del Congo el 1885, reconegut per les potències reunides a Berlín. La conquesta efectiva va durar fins als anys 1890. Bèlgica l'annexionà el 15 de novembre de 1908.",
    rwa: "El tractat anglo-alemany de 1890 atribuí la zona a Alemanya; el rei Yuhi V Musinga acceptà el protectorat el 1897.",
    bdi: "Pel tractat de Kiganda (1903) el mwami de Burundi es va sotmetre a Alemanya.",
    rwbe: "Ocupació belga el 1916; mandat de la Societat de Nacions des del 1922–1923 i tutela de l'ONU des del 1946.",
    caf: "Bangui es fundà el 1889; la colònia de l'Alt Ubangui data del 1894 i la d'Ubangui-Xari, del 1903–1905.",
    cog: "Tractat de Brazza amb el makoko dels teke (1880), ratificat per França el 1882.",
    cogn: "La República Popular es proclamà el 31 de desembre de 1969; el nom anterior es restablí el 1991 (Conferència Nacional Sobirana).",
    gab: "Hi havia presència francesa a Libreville des de 1839–1849; el Gabon formà part del Congo francès i fou colònia separada des del 1904.",
    dji: "França comprà Obock el 1862, però no hi establí administració fins al 1884.",
    ken: "La Companyia Imperial Britànica de l'Àfrica Oriental (1888) precedí el protectorat de 1895. La província de Rudolf (Turkana) formà part d'Uganda fins al 1926, i Jubalàndia, de Kenya fins al 1925.",
    tza: "La Companyia Alemanya de l'Àfrica Oriental rebé la carta imperial el 1885; la resistència (Abushiri, 1888–89; Mkwawa i els hehe, 1891–98) en va endarrerir la conquesta. Zanzíbar i Pemba foren protectorat britànic (1890–1963) i s'uniren a Tanganyika el 1964.",
    tza1919: "Les tropes britàniques i belgues van ocupar la colònia entre 1916 i 1917; el mandat britànic de Tanganyika es formalitzà el 1920–1922.",
    tgo: "Tropes franceses i britàniques van ocupar Togo l'agost de 1914 i se'l van repartir (mandats de 1922). La Togolàndia britànica es va integrar a Ghana el 1956–57.",
    cmr: "Entre 1911 i 1916 el Kamerun incloïa el Nou Kamerun, cedit per França (parts dels actuals Gabon, Congo, República Centreafricana i Txad). Els aliats el van ocupar entre 1914 i 1916. El Camerun britànic del sud s'uní al Camerun el 1961; el del nord, a Nigèria.",
    nam: "Walvis Bay era britànica (1878), passà a Sud-àfrica i no fou retornada a Namíbia fins al 1994. El 1971 el Tribunal Internacional de Justícia declarà il·legal l'ocupació sud-africana.",
    swz: "Per la convenció de 1894 Swazilàndia quedà sota protecció de la República Sud-africana (Transvaal); després de la guerra anglobòer passà a administració britànica (1903).",
    zmb: "La Companyia Britànica de Sud-àfrica (BSAC) va estendre la seva administració al nord del Zambeze a partir de 1890–1891 (tractat amb Lewanika, rei lozi, 1890). Rhodèsia del Nord es formà el 1911 i passà a la Corona el 1924.",
    zwe: "La Columna de Pioners de la BSAC s'instal·là a Salisbury el setembre de 1890. Guerra ndebele (1893) i primer chimurenga (1896–97). Colònia autogovernada pels colons blancs des del 1923.",
    mwi: "Protectorat de l'Àfrica Central Britànica (1891), rebatejat Niassalàndia el 1907.",
    mdg: "França declarà un protectorat discutit el 1885, conquerí Antananarivo el setembre de 1895 i annexionà l'illa el 1896; la monarquia merina fou abolida el 1897.",
    nga: "Lagos era colònia britànica des del 1861 i els Oil Rivers, protectorat des del 1884–85. El 1900 es crearen els protectorats de Nigèria del Nord i del Sud; Sokoto i Kano foren conquerits el 1903; l'amalgama es féu el 1914.",
    ner: "Territori militar creat el 1900; la resistència tuareg (revolta de Kaocen, 1916–17) va continuar; colònia el 1922.",
    mrt: "Protectorat declarat el 1903 (Coppolani); l'Adrar fou ocupat el 1909 i la «pacificació» no acabà fins al 1934.",
    bfa: "Ouagadougou fou ocupada el 1896. L'Alt Volta es creà el 1919, es dissolgué el 1932 entre Costa d'Ivori, el Sudan Francès i el Níger, i es reconstituí el 1947.",
    ben: "Porto-Novo era protectorat francès des del 1863 (de nou des del 1883). El regne de Dahomey fou conquerit entre 1892 i 1894 (rendició de Béhanzin, gener de 1894).",
    bwa: "Protectorat de Bechuanalàndia, proclamat el març de 1885.",
    uga: "Protectorat sobre Buganda el 1894, estès a la resta del territori a partir del 1896.",
    mli: "Ségou va caure el 1890 i l'imperi tucolor el 1893; Tombuctú fou ocupada el 1894. Entre 1904 i 1920 la colònia es va dir Alt Senegal-Níger.",
    gin: "La colònia dels Rivières du Sud es creà el 1882 i es rebatejà Guinea Francesa el 1891–1893; el Futa Jalon va ser ocupat el 1896–97 i Samori Touré, capturat el 1898.",
    civ: "Colònia creada el 1893; la conquesta de l'interior (baule i altres pobles) va durar fins al 1915.",
    gha: "La colònia costanera de la Costa d'Or data del 1874. Kumasi (Asante) va ser ocupada el 1896; Asante i els Territoris del Nord van ser annexionats formalment el 1901–1902, després de la guerra del Tamboret d'Or (1900).",
    ghafirst: "Sovint es diu que Ghana fou la primera colònia subsahariana independent; el Sudan ho havia estat el gener de 1956, i Etiòpia i Libèria no havien estat mai colonitzades (llevat de l'ocupació italiana d'Etiòpia, 1936–41).",
    tcd: "Batalla de Kousséri (1900). El sultanat de Wadai no va ser sotmès fins al 1909–1912, i Borku-Ennedi-Tibesti, fins als anys 1920–1930.",
    som: "Tractats de protectorat italians des del 1889; colònia el 1905–1908. L'estat dels dervixos de Mohammed Abdullah Hassan va resistir a l'interior de les colònies britànica i italiana entre 1899 i 1920.",
    sol: "Tractats britànics amb clans somalis (1884–1886); protectorat formal el 1887. Somalilàndia va proclamar la independència el 1991, sense reconeixement internacional.",
    sdn: "Conquesta turcoegípcia (1820–1874). Els mahdistes prengueren Khartum el gener de 1885 i foren derrotats a Omdurman el setembre de 1898; el condomini angloegipci es formalitzà el gener de 1899. El sultanat de Darfur, amb Ali Dinar, fou de facto independent fins al 1916. Font: M. W. Daly, <i>Darfur's Sorrow</i> (2007).",
    sds: "El control egipci i mahdista sobre el sud va ser parcial; molts pobles del sud (dinka, nuer, xilluk, azande) van resistir-se a tots dos.",
    egy: "El 1922 el Regne Unit declarà unilateralment la independència d'Egipte, però s'hi reservà la defensa, el canal de Suez i el Sudan; les tropes britàniques no marxaren del canal fins al 1956. La República Àrab Unida (amb Síria, 1958–61) mantingué el nom fins al 1971.",
    eri: "Itàlia ocupà Massaua el 1885 i creà la Colònia Eritrea el 1890. Federada a Etiòpia el 1952 i annexionada el 1962; independència de facto el 1991 i formal el 1993, després d'un referèndum.",
    sah: "Espanya proclamà el protectorat de Río de Oro el 1884, però no ocupà l'interior fins al 1934. Pels acords de Madrid (1975) en cedí l'administració al Marroc i Mauritània; Mauritània se'n retirà el 1979. El Front Polisario controla una franja oriental. Per a l'ONU continua sent un territori no autònom pendent de descolonització.",
    tun: "Beylicat autònom sota sobirania nominal otomana fins al tractat del Bardo (12 de maig de 1881).",
    lby: "La invasió italiana començà l'octubre de 1911 (tractat d'Ouchy, 1912), però fins al 1932 Itàlia només controlava la costa; la «reconquesta» de l'interior es va fer amb deportacions i camps de concentració. Font: A. A. Ahmida, <i>Genocide in Libya</i> (2021).",
    lby1969: "Cop d'estat de Gaddafi (1969): República Àrab Líbia; Jamahiriya des del 1977; Estat de Líbia des del 2011–2013.",
    mar: "Tractat de Fes (30 de març de 1912) i conveni francoespanyol (novembre de 1912). La resistència va continuar a l'Atles i al Rif fins al 1934.",
    eth: "Durant el repartiment, Etiòpia mateixa es va expandir militarment cap al sud, l'est i l'oest (Harar, 1887; territoris oromo, sidama, wolaita, somali, entre 1880 i 1900), amb una gran violència. Les seves fronteres actuals provenen d'aquesta expansió i de tractats amb les potències europees. Font: Bahru Zewde, <i>A History of Modern Ethiopia 1855–1991</i> (2001).",
    ethit: "Itàlia ocupà Addis Abeba el maig de 1936, però mai no va controlar tot el territori: la resistència (els arbegnoch) va continuar fins a l'alliberament de 1941.",
    lbr: "Libèria va ser fundada el 1822 per l'American Colonization Society per a afroamericans alliberats, i és independent des del 1847. La minoria americoliberiana va governar la majoria indígena fins al 1980; el 1930 una comissió de la Societat de Nacions hi va denunciar treball forçat. Va perdre territoris en favor del Regne Unit i França.",

    // Esdeveniments
    berlin: "Participants: Alemanya, Àustria-Hongria, Bèlgica, Dinamarca, Espanya, els Estats Units, França, Itàlia, els Països Baixos, Portugal, el Regne Unit, Rússia, Suècia-Noruega i l'Imperi otomà. Font: S. Förster, W. J. Mommsen i R. Robinson (eds.), <i>Bismarck, Europe and Africa: The Berlin Africa Conference 1884–1885</i> (1988).",
    congo: "El nombre de morts és objecte de debat perquè no hi ha censos fiables. A. Hochschild, <i>King Leopold's Ghost</i> (1998), seguint J. Vansina, estima una pèrdua de població d'uns 10 milions de persones entre 1880 i 1920; altres historiadors donen xifres més baixes. Les causes inclouen assassinats, fam, malalties i la caiguda de la natalitat.",
    eastafrica: "La frontera entre Kenya i Tanzània es fixà per l'acord anglo-alemany de 1886 i es prolongà fins al llac Victòria el 1890.",
    zulu: "Després de la batalla d'Ulundi (juliol de 1879), Wolseley dividí el regne en tretze cacicats. Font: J. Laband, <i>Rope of Sand</i> (1995).",
    benin: "Les estimacions van de 3.000 a més de 10.000 objectes. Font: D. Hicks, <i>The Brutish Museums</i> (2020). Des del 2022 Alemanya i altres estats n'han transferit la propietat a Nigèria.",
    omdurman: "Unes 10.000–11.000 baixes mortals sudaneses enfront de 48 de les tropes angloegípcies. Font: T. Pakenham, <i>The Scramble for Africa</i> (1991).",
    boer: "Xifres registrades: uns 27.900 bòers morts als camps (la gran majoria infants i dones) i almenys 14.150 africans negres en camps separats; aquesta segona xifra és probablement una subestimació (fins a 20.000). Font: P. Warwick, <i>Black People and the South African War</i> (1983).",
    herero: "Les estimacions varien: unes 60.000–65.000 víctimes herero (d'una població d'uns 80.000) i unes 10.000 nama. El maig de 2021 Alemanya ho reconegué com a genocidi «des de la perspectiva actual» i oferí 1.100 milions d'euros en ajuda al desenvolupament, que molts representants herero i nama han rebutjat per insuficient i no negociada amb ells. Fonts: H. Drechsler, <i>Let Us Die Fighting</i> (1966); D. Olusoga i C. Erichsen, <i>The Kaiser's Holocaust</i> (2010).",
    maji: "Les estimacions de 75.000 a 300.000 morts inclouen les víctimes de la fam provocada. Font: J. Iliffe, <i>A Modern History of Tanganyika</i> (1979).",
    libcamps: "Uns 100.000 deportats; estimacions de 40.000 morts o més. Font: Ahmida (2021).",
    landact: "La llei reservava al voltant del 7% de la terra a la població negra; el 1936 aquest percentatge s'amplià al voltant del 13%. Font: S. Plaatje, <i>Native Life in South Africa</i> (1916).",
    ww1: "França va reclutar uns 200.000 soldats a l'Àfrica occidental; a la campanya de l'Àfrica oriental es van mobilitzar més d'un milió de portadors, dels quals en moriren desenes de milers (més de 100.000 segons algunes estimacions). Font: H. Strachan, <i>The First World War in Africa</i> (2004).",
    rif: "Espanya va bombardejar amb gas mostassa i altres agents químics entre 1923 i 1927. Font: S. Balfour, <i>Deadly Embrace</i> (2002). França s'uní a la guerra el 1925.",
    yekatit: "Massacre de Yekatit 12 (febrer de 1937): les estimacions van d'uns 3.000 morts (fonts italianes) a 30.000 (fonts etíops); I. Campbell, <i>The Addis Ababa Massacre</i> (2017), n'estima unes 19.000.",
    thiaroye: "Xifra oficial francesa: 35 morts. Historiadores com Armelle Mabon apunten a un nombre molt més alt, encara no aclarit.",
    setif: "Les xifres van de ~1.500 (informe oficial francès) a 45.000 (xifra oficial algeriana); molts historiadors estimen entre diversos milers i 20.000–30.000. Font: J.-L. Planche, <i>Sétif 1945</i> (2006).",
    mdg47: "Les autoritats franceses van donar inicialment 89.000 morts i després 11.000; moltes víctimes moriren de fam i malaltia en ser desplaçades. Font: J. Tronchon, <i>L'insurrection malgache de 1947</i> (1974).",
    maumau: "C. Elkins, <i>Imperial Reckoning</i> (2005), estima fins a 160.000 persones detingudes; 1.090 kenyans foren penjats (D. Anderson, <i>Histories of the Hanged</i>, 2005). El 2013 el Regne Unit pagà 19,9 milions de lliures a 5.228 supervivents.",
    algwar: "Historiadors francesos estimen uns 250.000–300.000 morts algerians; el govern algerià en dona entre 1 i 1,5 milions. Font: B. Stora, <i>La gangrène et l'oubli</i> (1991).",
    kamerun: "Font: T. Deltombe, M. Domergue i J. Tatsitsa, <i>Kamerun!</i> (2011). Les xifres de víctimes són molt incertes.",
    lumumba: "Una comissió parlamentària belga (2001) va concloure que Bèlgica tenia una «responsabilitat moral» en l'assassinat; el govern belga en demanà perdó el 2002. La CIA també n'havia planejat l'eliminació.",
    biafra: "Les estimacions van de 500.000 a 2 milions de morts, majoritàriament civils morts de fam a causa del bloqueig.",
    rwanda: "Les estimacions van de 500.000 a més d'un milió de morts; la xifra més citada és d'uns 800.000. Fonts: A. Des Forges, <i>Leave None to Tell the Story</i> (1999); M. Mamdani, <i>When Victims Become Killers</i> (2001).",
    oau: "Resolució AHG/Res. 16(I) de la cimera del Caire de l'OUA (juliol de 1964).",
    cities7577: "Algunes fonts daten aquests canvis de nom el 1977 en lloc del 1975.",
    chlef: "Orléansville es rebatejà El Asnam el 1964 i, després del terratrèmol de 1980, Chlef (1981)."
  };

  // ---------------------------------------------------------------- Països
  // [any, poder, nom en aquell moment, [notes]]. "PRE" deixa veure el mapa de 1880 a sota.
  const T = (...rows) => rows;
  const COUNTRIES = {
    DZA: { name: "Algèria", t: T([1870, "PRE", null, ["dza"]], [1900, "FR", "Algèria francesa", ["dza"]], [1962, "IND", "Algèria"]) },
    AGO: { name: "Angola", t: T([1870, "PRE"], [1891, "PT", "Angola portuguesa", ["angmoz"]], [1975, "IND", "Angola"]) },
    BEN: { name: "Benín", t: T([1870, "PRE"], [1894, "FR", "Dahomey (França)", ["ben"]], [1960, "IND", "Dahomey"], [1975, "IND", "Benín"]) },
    BWA: { name: "Botswana", t: T([1870, "PRE"], [1885, "GB", "Bechuanalàndia", ["bwa"]], [1966, "IND", "Botswana"]) },
    BFA: { name: "Burkina Faso", t: T([1870, "PRE"], [1896, "FR", "País mossi (França)", ["bfa"]], [1919, "FR", "Alt Volta", ["bfa"]], [1932, "FR", "Alt Volta (repartit entre colònies veïnes)", ["bfa"]], [1947, "FR", "Alt Volta"], [1960, "IND", "Alt Volta"], [1984, "IND", "Burkina Faso"]) },
    BDI: { name: "Burundi", t: T([1870, "PRE"], [1903, "DE", "Urundi (Àfrica Oriental Alemanya)", ["bdi"]], [1916, "BE", "Ruanda-Urundi (Bèlgica)", ["rwbe"]], [1962, "IND", "Burundi"]) },
    CMR: { name: "Camerun", t: T([1870, "PRE"], [1884, "DE", "Kamerun (Alemanya)", ["cmr"]], [1916, "FR", "Camerun francès i britànic", ["cmr"]], [1960, "IND", "Camerun", ["cmr"]]) },
    CPV: { name: "Cap Verd", t: T([1870, "PT", "Cap Verd (Portugal)", ["islands"]], [1975, "IND", "Cap Verd"]) },
    CAF: { name: "República Centreafricana", t: T([1870, "PRE"], [1894, "FR", "Alt Ubangui (França)", ["caf"]], [1903, "FR", "Ubangui-Xari"], [1960, "IND", "República Centreafricana"], [1976, "IND", "Imperi Centreafricà"], [1979, "IND", "República Centreafricana"]) },
    TCD: { name: "Txad", t: T([1870, "PRE"], [1900, "FR", "Txad (França)", ["tcd"]], [1960, "IND", "Txad"]) },
    COM: { name: "Comores", t: T([1870, "PRE"], [1886, "FR", "Comores (França)", ["com"]], [1975, "IND", "Comores", ["com"]]) },
    COG: { name: "Rep. del Congo", t: T([1870, "PRE"], [1880, "FR", "Congo francès", ["cog"]], [1903, "FR", "Mitjà Congo (França)"], [1960, "IND", "República del Congo"], [1969, "IND", "República Popular del Congo", ["cogn"]], [1991, "IND", "República del Congo", ["cogn"]]) },
    COD: { name: "RD del Congo", t: T([1870, "PRE"], [1885, "LEO", "Estat Lliure del Congo", ["cod"]], [1908, "BE", "Congo Belga", ["cod"]], [1960, "IND", "República del Congo (Léopoldville)"], [1971, "IND", "Zaire"], [1997, "IND", "República Democràtica del Congo"]) },
    CIV: { name: "Costa d'Ivori", t: T([1870, "PRE"], [1893, "FR", "Costa d'Ivori (França)", ["civ"]], [1960, "IND", "Costa d'Ivori"]) },
    DJI: { name: "Djibouti", t: T([1870, "PRE"], [1884, "FR", "Obock (França)", ["dji"]], [1896, "FR", "Somàlia Francesa"], [1967, "FR", "Territori dels Àfars i els Issas"], [1977, "IND", "Djibouti"]) },
    EGY: { name: "Egipte", t: T([1870, "OT", "Khedivat d'Egipte (sobirania otomana)", ["egypt"]], [1882, "GB", "Egipte (ocupació britànica)"], [1914, "GB", "Protectorat britànic d'Egipte"], [1922, "IND", "Regne d'Egipte (independència limitada)", ["egy"]], [1953, "IND", "República d'Egipte"], [1958, "IND", "República Àrab Unida", ["egy"]], [1971, "IND", "Egipte"]) },
    GNQ: { name: "Guinea Equatorial", t: T([1870, "PRE", null, ["gnq"]], [1900, "ES", "Guinea Espanyola", ["gnq"]], [1968, "IND", "Guinea Equatorial"]) },
    ERI: { name: "Eritrea", t: T([1870, "PRE"], [1890, "IT", "Colònia Eritrea (Itàlia)", ["eri"]], [1941, "GB", "Eritrea (administració britànica)"], [1952, "OCC", "Eritrea (federada a Etiòpia)", ["eri"]], [1962, "OCC", "Eritrea (annexionada per Etiòpia)", ["eri"]], [1993, "IND", "Eritrea", ["eri"]]) },
    SWZ: { name: "Eswatini", t: T([1870, "PRE"], [1894, "SET", "Swazilàndia (protectorat del Transvaal)", ["swz", "set"]], [1903, "GB", "Swazilàndia (Regne Unit)", ["swz"]], [1968, "IND", "Swazilàndia"], [2018, "IND", "Eswatini"]) },
    ETH: { name: "Etiòpia", t: T([1870, "AF", "Etiòpia (Abissínia)", ["eth"]], [1936, "IT", "Àfrica Oriental Italiana", ["ethit"]], [1941, "AF", "Etiòpia"]) },
    GAB: { name: "Gabon", t: T([1870, "PRE"], [1886, "FR", "Gabon (França)", ["gab"]], [1960, "IND", "Gabon"]) },
    GMB: { name: "Gàmbia", t: T([1870, "PRE", null, ["gmb"]], [1894, "GB", "Gàmbia (colònia i protectorat)", ["gmb"]], [1965, "IND", "Gàmbia"]) },
    GHA: { name: "Ghana", t: T([1870, "PRE"], [1896, "GB", "Costa d'Or i Asante (Regne Unit)", ["gha"]], [1957, "IND", "Ghana", ["ghafirst"]]) },
    GIN: { name: "Guinea", t: T([1870, "PRE"], [1891, "FR", "Guinea Francesa", ["gin"]], [1958, "IND", "Guinea"]) },
    GNB: { name: "Guinea Bissau", t: T([1870, "PRE"], [1879, "PT", "Guinea Portuguesa", ["gnb"]], [1974, "IND", "Guinea Bissau", ["gnb"]]) },
    KEN: { name: "Kenya", t: T([1870, "PRE"], [1895, "GB", "Protectorat de l'Àfrica Oriental", ["ken"]], [1920, "GB", "Colònia de Kenya"], [1963, "IND", "Kenya"]) },
    LSO: { name: "Lesotho", t: T([1870, "GB", "Basutolàndia (Regne Unit)", ["lso"]], [1966, "IND", "Lesotho"]) },
    LBR: { name: "Libèria", t: T([1870, "AF", "Libèria", ["lbr"]]) },
    LBY: { name: "Líbia", t: T([1870, "OT", "Tripolitània i Cirenaica (Imperi otomà)", ["ot"]], [1911, "IT", "Líbia italiana", ["lby"]], [1943, "GB", "Líbia (administració britànica i francesa)"], [1951, "IND", "Regne de Líbia"], [1969, "IND", "Líbia", ["lby1969"]]) },
    MDG: { name: "Madagascar", t: T([1870, "PRE"], [1895, "FR", "Madagascar (França)", ["mdg"]], [1960, "IND", "República Malgaixa"], [1975, "IND", "Madagascar"]) },
    MWI: { name: "Malawi", t: T([1870, "PRE"], [1891, "GB", "Àfrica Central Britànica", ["mwi"]], [1907, "GB", "Niassalàndia"], [1953, "GB", "Niassalàndia (Federació de Rhodèsia i Niassalàndia)"], [1964, "IND", "Malawi"]) },
    MLI: { name: "Mali", t: T([1870, "PRE"], [1893, "FR", "Sudan Francès", ["mli"]], [1904, "FR", "Alt Senegal-Níger", ["mli"]], [1920, "FR", "Sudan Francès"], [1960, "IND", "Mali"]) },
    MRT: { name: "Mauritània", t: T([1870, "PRE"], [1903, "FR", "Mauritània (França)", ["mrt"]], [1960, "IND", "Mauritània"]) },
    MUS: { name: "Maurici", t: T([1870, "GB", "Maurici (Regne Unit)", ["islands"]], [1968, "IND", "Maurici"]) },
    MAR: { name: "Marroc", t: T([1870, "AF", "Sultanat del Marroc"], [1912, "FR", "Marroc (protectorats francès i espanyol)", ["mar"]], [1956, "IND", "Marroc"]) },
    MOZ: { name: "Moçambic", t: T([1870, "PRE"], [1891, "PT", "Moçambic portuguès", ["angmoz"]], [1975, "IND", "Moçambic"]) },
    NAM: { name: "Namíbia", t: T([1870, "PRE"], [1884, "DE", "Àfrica del Sud-oest Alemanya"], [1915, "SET", "Àfrica del Sud-oest (ocupada per Sud-àfrica)", ["nam", "set"]], [1990, "IND", "Namíbia", ["nam"]]) },
    NER: { name: "Níger", t: T([1870, "PRE"], [1900, "FR", "Territori militar del Níger (França)", ["ner"]], [1922, "FR", "Colònia del Níger"], [1960, "IND", "Níger"]) },
    NGA: { name: "Nigèria", t: T([1870, "PRE"], [1900, "GB", "Protectorats de Nigèria del Nord i del Sud", ["nga"]], [1914, "GB", "Colònia i Protectorat de Nigèria", ["nga"]], [1960, "IND", "Nigèria"]) },
    RWA: { name: "Ruanda", t: T([1870, "PRE"], [1897, "DE", "Ruanda (Àfrica Oriental Alemanya)", ["rwa"]], [1916, "BE", "Ruanda-Urundi (Bèlgica)", ["rwbe"]], [1962, "IND", "Ruanda"]) },
    STP: { name: "São Tomé i Príncipe", t: T([1870, "PT", "São Tomé i Príncipe (Portugal)", ["islands"]], [1975, "IND", "São Tomé i Príncipe"]) },
    SEN: { name: "Senegal", t: T([1870, "PRE", null, ["sen"]], [1886, "FR", "Senegal (França)", ["sen"]], [1960, "IND", "Senegal"]) },
    SYC: { name: "Seychelles", t: T([1870, "GB", "Seychelles (Regne Unit)", ["islands"]], [1976, "IND", "Seychelles"]) },
    SLE: { name: "Sierra Leone", t: T([1870, "PRE"], [1896, "GB", "Sierra Leone (colònia i protectorat)", ["sle"]], [1961, "IND", "Sierra Leone"]) },
    SOM: { name: "Somàlia", t: T([1870, "PRE"], [1889, "IT", "Somàlia Italiana", ["som"]], [1941, "GB", "Somàlia (administració britànica)"], [1950, "IT", "Somàlia (tutela italiana de l'ONU)"], [1960, "IND", "Somàlia"]) },
    SOL: { name: "Somalilàndia", t: T([1870, "PRE"], [1884, "GB", "Somalilàndia Britànica", ["sol", "som"]], [1960, "IND", "Somàlia"], [1991, "IND", "Somalilàndia (autoproclamada, no reconeguda)", ["sol"]]) },
    ZAF: { name: "Sud-àfrica", t: T([1870, "PRE", null, ["zaf"]], [1902, "GB", "Colònies britàniques (després de la guerra anglobòer)", ["zaf"]], [1910, "SET", "Unió Sud-africana (domini de minoria blanca)", ["zaf1910", "set"]], [1948, "SET", "Unió Sud-africana (apartheid)"], [1961, "SET", "República de Sud-àfrica (apartheid)"], [1994, "IND", "Sud-àfrica"]) },
    SDN: { name: "Sudan", t: T([1870, "OT", "Sudan turcoegipci", ["egypt", "sdn"]], [1885, "AF", "Estat mahdista", ["sdn"]], [1899, "GB", "Sudan angloegipci", ["sdn"]], [1956, "IND", "Sudan"]) },
    SDS: { name: "Sudan del Sud", t: T([1870, "OT", "Sudan turcoegipci", ["sds"]], [1885, "AF", "Estat mahdista", ["sds"]], [1899, "GB", "Sudan angloegipci"], [1956, "IND", "Sudan"], [2011, "IND", "Sudan del Sud"]) },
    TZA: { name: "Tanzània", t: T([1870, "PRE"], [1885, "DE", "Àfrica Oriental Alemanya", ["tza"]], [1919, "GB", "Territori de Tanganyika", ["tza1919"]], [1961, "IND", "Tanganyika"], [1964, "IND", "Tanzània", ["tza"]]) },
    TGO: { name: "Togo", t: T([1870, "PRE"], [1884, "DE", "Togolàndia (Alemanya)"], [1914, "FR", "Togo (ocupació francobritànica)", ["tgo"]], [1922, "FR", "Togo francès (mandat)", ["tgo"]], [1960, "IND", "Togo"]) },
    TUN: { name: "Tunísia", t: T([1870, "OT", "Beylicat de Tunis", ["tun"]], [1881, "FR", "Protectorat francès de Tunísia"], [1956, "IND", "Tunísia"]) },
    UGA: { name: "Uganda", t: T([1870, "PRE"], [1894, "GB", "Protectorat d'Uganda", ["uga"]], [1962, "IND", "Uganda"]) },
    SAH: { name: "Sàhara Occidental", t: T([1870, "PRE"], [1884, "ES", "Sàhara Espanyol (Río de Oro)", ["sah"]], [1976, "OCC", "Sàhara Occidental (ocupat pel Marroc)", ["sah"]]) },
    ZMB: { name: "Zàmbia", t: T([1870, "PRE"], [1891, "GB", "Rhodèsia (Companyia Britànica de Sud-àfrica)", ["zmb"]], [1911, "GB", "Rhodèsia del Nord", ["zmb"]], [1953, "GB", "Rhodèsia del Nord (Federació)"], [1964, "IND", "Zàmbia"]) },
    ZWE: { name: "Zimbabwe", t: T([1870, "PRE"], [1890, "GB", "Rhodèsia (Companyia Britànica de Sud-àfrica)", ["zwe"]], [1923, "SET", "Rhodèsia del Sud (colònia de colons blancs)", ["zwe", "set"]], [1965, "SET", "Rhodèsia (règim de minoria blanca)"], [1980, "IND", "Zimbabwe"]) }
  };

  // ---------------------------------------------------------------- Mapa de 1880
  // nom original → [nom en català, poder, [notes]]
  const P1880 = {
    "Morocco": ["Sultanat del Marroc", "AF"], "Mozambique": ["Moçambic (Portugal)", "PT", ["moz1880"]],
    "Cape Colony": ["Colònia del Cap", "GB"], "Natal": ["Natal", "GB"], "Basutoland": ["Basutolàndia", "GB", ["lso"]],
    "Zululand": ["Regne zulu", "AF"], "Swaziland": ["Regne swazi", "AF"], "Orange Free State": ["Estat Lliure d'Orange (bòer)", "SET", ["set"]],
    "Transvaal": ["Transvaal (annexionat pel Regne Unit, 1877–1881)", "GB", ["transvaal"]], "Griqualand West": ["Griqualand Occidental", "GB"], "Ndebele": ["Regne ndebele", "AF"],
    "Ngwato": ["Bamangwato", "AF"], "Lozi": ["Regne lozi (Barotselàndia)", "AF", ["lozi"]], "Sultanate of Zanzibar": ["Sultanat de Zanzíbar", "AF", ["zanzibar"]],
    "Shona": ["Pobles xona", "AF", ["shona"]], "Bunyoro": ["Bunyoro", "AF"], "Buganda": ["Buganda", "AF"],
    "Yeke": ["Regne yeke (Garanganze)", "AF"], "Mirambo Unyanyembe Ukimbu": ["Mirambo (Unyanyembe)", "AF"], "Burundi": ["Regne de Burundi", "AF"],
    "Nguni": ["Ngoni", "AF"], "Rwanda": ["Regne de Ruanda", "AF"], "Sultanate of Utetera": ["Utetera", "AF"], "Lunda": ["Imperi lunda", "AF"],
    "Luba": ["Imperi luba", "AF"], "Kuba": ["Regne kuba", "AF"], "Angola (Portugal)": ["Angola (Portugal)", "PT"], "Ovimbundu": ["Ovimbundu", "AF"],
    "Mbailundu": ["Mbailundu", "AF"], "Kongo Kingdom": ["Regne del Kongo", "AF", ["kongo"]], "Teke": ["Regne teke", "AF"], "Yaka": ["Yaka", "AF"],
    "Algeria (FR)": ["Algèria (França)", "FR", ["dza"]], "Kanem-Bornu": ["Kanem-Bornu", "AF"], "Ibadan": ["Ibadan", "AF"], "Benin": ["Regne de Benín", "AF"],
    "Lagos": ["Lagos (Regne Unit)", "GB"], "Cotonou": ["Porto-Novo i Cotonou (França)", "FR", ["ben"]], "Gold Coast (GB)": ["Costa d'Or (Regne Unit)", "GB"],
    "Ivory Coast": ["Factories franceses", "FR"], "Asante": ["Imperi asante", "AF"], "Sierra Leone": ["Freetown (Regne Unit)", "GB", ["sle"]],
    "Liberia": ["Libèria", "AF", ["liberia1880", "lbr"]], "Gambia": ["Gàmbia (Regne Unit)", "GB", ["gmb"]], "Portuguese Guinea": ["Guinea Portuguesa", "PT", ["pguinea1880"]],
    "Senegal (FR)": ["Senegal (França)", "FR", ["sen"]], "Futa Toro": ["Futa Toro", "AF"], "Mossi States": ["Regnes mossi", "AF"],
    "Futa Jalon": ["Imamat de Futa Jalon", "AF"], "Aro Confederacy": ["Confederació aro", "AF"], "Spanish Guinea": ["Fernando Póo (Espanya)", "ES", ["gnq"]],
    "Gabon": ["Gabon (França)", "FR", ["gab"]], "Ethiopia": ["Etiòpia", "AF", ["eth"]], "Harer (Egypt)": ["Harar (ocupació egípcia)", "OT", ["egypt"]],
    "Imerina": ["Regne merina", "AF"], "Madagascar": ["Madagascar (sakalava, betsileo i altres)", "AF"], "Dahomey": ["Regne de Dahomey", "AF"],
    "Sokoto Caliphate": ["Califat de Sokoto", "AF"], "Borgu States": ["Estats de Borgu", "AF"], "Oyo": ["Oyo", "AF"], "Calabar": ["Calabar", "AF"],
    "Sultanate of Damagaram": ["Sultanat de Damagaram", "AF"], "Opobo": ["Opobo", "AF"], "Wadai Empire": ["Sultanat de Wadai", "AF"],
    "Dendi Kingdom": ["Regne dendi (localització dubtosa)", "AF", ["dendi"]], "Kong Empire": ["Imperi de Kong", "AF"], "Wassoulou Empire": ["Imperi de Wassoulou (Samori Touré)", "AF"],
    "Tukular Caliphate": ["Imperi tucolor", "AF"], "Rabih az-Zubayr": ["Rabih az-Zubayr", "AF", ["rabih"]], "Egypt": ["Egipte i Sudan (khedivat)", "OT", ["egypt"]],
    "Ottoman Empire": ["Tripolitània, Cirenaica i Tunísia (otomans)", "OT", ["ot"]]
  };

  // Unitats de 1914 (reconstruïdes a build/build.py)
  const P1914 = {
    "Abyssinia": ["Etiòpia (Abissínia)", "AF", ["eth"]], "Algeria": ["Algèria", "FR"], "Anglo-Egyptian Sudan": ["Sudan angloegipci", "GB", ["sdn"]],
    "Angola": ["Angola", "PT", ["angmoz"]], "Belgian Congo": ["Congo Belga", "BE"], "Bechuanaland": ["Bechuanalàndia", "GB"],
    "British East Africa": ["Àfrica Oriental Britànica", "GB", ["ken"]], "British Somaliland": ["Somalilàndia Britànica", "GB", ["som"]],
    "Djibouti": ["Somàlia Francesa", "FR"], "Egypt": ["Egipte (protectorat britànic des del desembre)", "GB"], "Spanish Guinea": ["Guinea Espanyola", "ES"],
    "Eritrea": ["Eritrea", "IT"], "French Equatorial Africa": ["Àfrica Equatorial Francesa", "FR", ["tcd"]], "French West Africa": ["Àfrica Occidental Francesa", "FR", ["mrt"]],
    "Gambia": ["Gàmbia", "GB"], "German East Africa": ["Àfrica Oriental Alemanya", "DE", ["tza"]], "German South-West Africa": ["Àfrica del Sud-oest Alemanya", "DE", ["nam"]],
    "Gold Coast": ["Costa d'Or", "GB"], "Italian Somaliland": ["Somàlia Italiana", "IT", ["som"]], "Kamerun": ["Kamerun (amb el Nou Kamerun)", "DE", ["cmr"]], "Basutoland": ["Basutolàndia", "GB"],
    "Liberia": ["Libèria", "AF", ["lbr"]], "Libya": ["Líbia (només la costa, de fet)", "IT", ["lby"]], "Madagascar": ["Madagascar i Comores", "FR"], "Nyasaland": ["Niassalàndia", "GB"],
    "Morocco": ["Marroc (protectorat francès)", "FR", ["mar"]], "Mozambique": ["Moçambic", "PT", ["angmoz"]], "Nigeria": ["Nigèria", "GB"],
    "Portuguese Guinea": ["Guinea Portuguesa", "PT", ["gnb"]], "Rhodesia": ["Rhodèsia (BSAC)", "GB", ["zmb"]], "Sierra Leone": ["Sierra Leone", "GB"],
    "Union of South Africa": ["Unió Sud-africana", "SET", ["zaf1910"]], "Spanish Morocco": ["Protectorat espanyol del Marroc", "ES", ["mar"]], "Spanish Sahara": ["Sàhara Espanyol i Cap Juby", "ES", ["sah"]],
    "Swaziland": ["Swazilàndia", "GB"], "Togoland": ["Togolàndia", "DE", ["tgo"]], "Tunisia": ["Tunísia (protectorat francès)", "FR"], "Uganda": ["Uganda (amb la província de Rudolf)", "GB", ["ken"]],
    "Cape Verde": ["Cap Verd", "PT"], "Sao Tome": ["São Tomé i Príncipe", "PT"], "Mauritius": ["Maurici", "GB"], "Seychelles": ["Seychelles", "GB"]
  };

  // ---------------------------------------------------------------- Esdeveniments
  // k: conquesta | resistencia | violencia | frontera | independencia
  const EVENTS = [
    { y: 1870, k: "frontera", t: "Abans del repartiment", c: [], n: ["base1880", "hatch"], d: "Cap a 1870 Europa controla formalment menys d'una desena part del continent, sobretot a la costa: el nord d'Algèria, la colònia del Cap, enclavaments a l'Àfrica occidental. La resta és un mosaic de regnes, imperis, califats, ciutats estat i societats sense estat centralitzat." },
    { y: 1879, k: "resistencia", t: "Isandlwana", c: ["ZAF"], n: ["zulu"], d: "L'exèrcit zulu derrota l'exèrcit britànic (22 de gener). Sis mesos després, a Ulundi, els britànics derroten els zulus i divideixen el regne en tretze cacicats." },
    { y: 1881, k: "conquesta", t: "França ocupa Tunísia", c: ["TUN"], n: ["tun"], d: "El tractat del Bardo converteix Tunísia en protectorat francès." },
    { y: 1882, k: "conquesta", t: "El Regne Unit ocupa Egipte", c: ["EGY"], d: "El control del canal de Suez justifica una ocupació militar que durarà, d'una manera o altra, fins al 1956." },
    { y: 1884, k: "frontera", t: "Conferència de Berlín", c: [], n: ["berlin"], d: "Del novembre de 1884 al febrer de 1885, catorze estats —dotze d'europeus, l'Imperi otomà i els Estats Units— fixen les regles per repartir-se l'Àfrica. No hi ha cap representant africà. La conferència no dibuixa totes les fronteres, però estableix el principi d'«ocupació efectiva» que accelera la cursa per conquerir el continent." },
    { y: 1885, k: "violencia", t: "L'Estat Lliure del Congo", c: ["COD"], n: ["congo"], d: "Un territori de més de 2 milions de km² esdevé propietat personal del rei Leopold II de Bèlgica. El règim de treball forçat per extreure cautxú i ivori —amb ostatges, mutilacions i execucions— provoca la mort de milions de persones." },
    { y: 1885, k: "resistencia", t: "La revolució mahdista", c: ["SDN", "SDS"], n: ["sdn"], d: "Les forces del Mahdi prenen Khartum i expulsen l'administració egípcia. L'estat mahdista resisteix fins al 1898." },
    { y: 1890, k: "frontera", t: "Fronteres amb regle", c: ["KEN", "TZA", "UGA"], n: ["eastafrica"], d: "Els acords anglo-alemanys de 1886 i 1890 es reparteixen l'Àfrica oriental amb línies rectes traçades sobre mapes incomplets, que travessen els territoris de pobles com els massais." },
    { y: 1896, k: "resistencia", t: "Adwa", c: ["ETH"], n: ["eth"], d: "L'exèrcit etíop de Menelik II derrota Itàlia (1 de març). Etiòpia serà, amb Libèria, l'únic estat africà que conservarà la independència durant el repartiment." },
    { y: 1897, k: "violencia", t: "El saqueig de Benín", c: ["NGA"], n: ["benin"], d: "Una expedició punitiva britànica arrasa la ciutat de Benín i s'emporta milers d'obres d'art —els bronzes de Benín—, que encara avui són majoritàriament en museus europeus i nord-americans." },
    { y: 1898, k: "violencia", t: "Omdurman", c: ["SDN"], n: ["omdurman"], d: "Amb metralladores Maxim, l'exèrcit de Kitchener mata unes 10.000 persones en un sol matí. El mateix any França captura Samori Touré, que havia resistit setze anys." },
    { y: 1899, k: "violencia", t: "Guerra anglobòer", c: ["ZAF"], n: ["boer"], d: "1899–1902. Als camps de concentració britànics hi moren unes 26.000 dones i infants bòers i, en camps separats, almenys 14.000 africans negres, sovint oblidats." },
    { y: 1904, k: "violencia", t: "Genocidi herero i nama", c: ["NAM"], n: ["herero"], d: "1904–1908. L'ordre d'extermini del general Von Trotha condemna els herero al desert d'Omaheke. Hi moren al voltant del 80% dels herero i la meitat dels nama. Alemanya no ho va reconèixer com a genocidi fins al 2021." },
    { y: 1905, k: "violencia", t: "Maji Maji", c: ["TZA"], n: ["maji"], d: "1905–1907. La rebel·lió contra el cultiu forçat de cotó és aixafada amb una política de terra cremada i fam: entre 75.000 i 300.000 morts." },
    { y: 1908, k: "violencia", t: "El Congo passa a Bèlgica", c: ["COD"], n: ["cod"], d: "Després d'una campanya internacional de denúncia, Leopold II ha de cedir el Congo a l'estat belga. El treball forçat continua sota una altra bandera." },
    { y: 1911, k: "violencia", t: "Itàlia envaeix Líbia", c: ["LBY"], n: ["lby", "libcamps"], d: "La resistència, encapçalada a la Cirenaica per Omar Mukhtar, dura vint anys. Entre 1930 i 1933 Itàlia deporta la població de la Cirenaica a camps de concentració on moren desenes de milers de persones." },
    { y: 1913, k: "violencia", t: "Llei de terres indígenes", c: ["ZAF"], n: ["landact"], d: "La Unió Sud-africana reserva a la majoria negra al voltant del 7% de la terra. És un dels fonaments de l'apartheid." },
    { y: 1914, k: "frontera", t: "Un continent repartit", c: ["ETH", "LBR"], n: ["share", "ww1"], d: "Només Etiòpia i Libèria resten independents. Més del 90% del territori africà és sota domini europeu. Durant la Primera Guerra Mundial, més d'un milió d'africans són mobilitzats com a soldats o portadors." },
    { y: 1919, k: "frontera", t: "Colònies com a botí de guerra", c: ["TGO", "CMR", "TZA", "RWA", "BDI", "NAM"], n: ["tgo", "cmr"], d: "Les colònies alemanyes es reparteixen entre els vencedors com a «mandats» de la Societat de Nacions. Togo i el Camerun queden partits en dos; l'Àfrica del Sud-oest passa a Sud-àfrica." },
    { y: 1921, k: "resistencia", t: "La República del Rif", c: ["MAR"], n: ["rif"], d: "Abd el-Krim derrota l'exèrcit espanyol a Annual. Espanya bombardeja la població del Rif amb gas tòxic; amb el suport de França, la república és derrotada el 1926." },
    { y: 1935, k: "violencia", t: "Itàlia envaeix Etiòpia", c: ["ETH"], n: ["yekatit", "ethit"], d: "Mussolini fa servir gas mostassa contra soldats i civils. El 1937, en represàlia per un atemptat, milers d'habitants d'Addis Abeba són massacrats." },
    { y: 1944, k: "violencia", t: "Thiaroye", c: ["SEN"], n: ["thiaroye"], d: "L'exèrcit francès dispara contra tiradors africans que reclamaven les pagues endarrerides després de lluitar a Europa." },
    { y: 1945, k: "violencia", t: "Sétif i Guelma", c: ["DZA"], n: ["setif"], d: "El 8 de maig, mentre Europa celebra la fi del nazisme, una manifestació nacionalista a Algèria acaba en una repressió que causa entre milers i desenes de milers de morts." },
    { y: 1947, k: "violencia", t: "Insurrecció malgaixa", c: ["MDG"], n: ["mdg47"], d: "La repressió francesa de l'aixecament a Madagascar causa desenes de milers de morts." },
    { y: 1948, k: "violencia", t: "Apartheid", c: ["ZAF"], d: "Sud-àfrica institucionalitza la segregació racial com a sistema d'estat." },
    { y: 1952, k: "violencia", t: "Mau Mau", c: ["KEN"], n: ["maumau"], d: "1952–1960. Desenes de milers de kenyans, sobretot kikuyus, són tancats en camps de detenció on la tortura és sistemàtica. El Regne Unit no va acceptar indemnitzar supervivents fins al 2013." },
    { y: 1954, k: "violencia", t: "Guerra d'Algèria", c: ["DZA"], n: ["algwar"], d: "1954–1962. Centenars de milers de morts algerians i tortura sistemàtica per part de l'exèrcit francès." },
    { y: 1955, k: "violencia", t: "La guerra oculta del Camerun", c: ["CMR"], n: ["kamerun"], d: "La repressió francesa del moviment independentista UPC, que continua després de la independència, causa desenes de milers de morts." },
    { y: 1957, k: "independencia", t: "Ghana", c: ["GHA"], n: ["ghafirst"], d: "La Costa d'Or s'independitza i Kwame Nkrumah tria el nom d'un antic imperi africà. És un símbol per a tot el continent." },
    { y: 1958, k: "independencia", t: "Guinea diu no", c: ["GIN"], d: "Guinea rebutja la Comunitat Francesa en referèndum i s'independitza. França se'n va emportant-se arxius, material i personal tècnic." },
    { y: 1960, k: "independencia", t: "L'any d'Àfrica", c: ["CMR", "TGO", "MDG", "COD", "SOM", "BEN", "NER", "BFA", "CIV", "TCD", "CAF", "COG", "GAB", "SEN", "MLI", "NGA", "MRT"], d: "Disset països s'independitzen en un sol any. Però les noves nacions hereten les fronteres traçades a Europa. El mateix any, la policia sud-africana mata 69 manifestants a Sharpeville." },
    { y: 1961, k: "violencia", t: "Assassinat de Lumumba", c: ["COD"], n: ["lumumba"], d: "El primer ministre del Congo independent és assassinat amb la participació d'oficials belgues i la complicitat de serveis secrets occidentals. Comença també la guerra d'alliberament a Angola." },
    { y: 1963, k: "frontera", t: "La paradoxa de les fronteres", c: [], n: ["oau"], d: "La nova Organització per la Unitat Africana decideix (1964) respectar les fronteres heretades de la colonització per evitar guerres entre estats. Les línies traçades pels colonitzadors es tornen intocables." },
    { y: 1965, k: "violencia", t: "Rhodèsia", c: ["ZWE"], d: "La minoria blanca declara la independència unilateral per evitar el govern de la majoria negra. Seguirà una guerra d'alliberament fins al 1979." },
    { y: 1967, k: "violencia", t: "Biafra", c: ["NGA"], n: ["biafra"], d: "1967–1970. La guerra de secessió a Nigèria, un estat creat per l'amalgama colonial de 1914, causa entre mig milió i dos milions de morts, majoritàriament per fam." },
    { y: 1975, k: "independencia", t: "Fi de l'imperi portuguès", c: ["AGO", "MOZ", "CPV", "STP", "GNB"], n: ["gnb"], d: "Després de tretze anys de guerres colonials i la Revolució dels Clavells (1974), Portugal reconeix la independència de les seves colònies." },
    { y: 1976, k: "violencia", t: "Sàhara Occidental i Soweto", c: ["SAH", "ZAF"], n: ["sah"], d: "Espanya abandona el Sàhara sense descolonitzar-lo i el Marroc l'ocupa; el poble sahrauí encara espera un referèndum d'autodeterminació. A Soweto, la policia de l'apartheid dispara contra estudiants." },
    { y: 1990, k: "independencia", t: "Namíbia", c: ["NAM"], n: ["nam"], d: "Namíbia s'independitza de Sud-àfrica. Nelson Mandela surt de la presó." },
    { y: 1993, k: "independencia", t: "Eritrea", c: ["ERI"], n: ["eri"], d: "Després de trenta anys de guerra, Eritrea s'independitza d'Etiòpia: és la primera secessió reconeguda internacionalment a l'Àfrica postcolonial. La seva frontera és la de la colònia italiana." },
    { y: 1994, k: "violencia", t: "Ruanda i Sud-àfrica", c: ["RWA", "ZAF"], n: ["rwanda"], d: "Genocidi contra els tutsis: centenars de milers de persones assassinades en cent dies. L'administració colonial belga havia rigiditzat les categories ètniques amb carnets d'identitat (1933–34). El mateix any, Sud-àfrica celebra les primeres eleccions democràtiques." },
    { y: 2011, k: "independencia", t: "Sudan del Sud", c: ["SDS"], d: "Després de dècades de guerra, el Sudan del Sud s'independitza. Les fronteres colonials continuen sent font de conflictes." }
  ];

  // ---------------------------------------------------------------- Canvis de nom
  const RENAMES = [
    { a3: "GHA", from: ["Costa d'Or"], to: "Ghana", y: 1957, why: "Pren el nom de l'antic Imperi de Ghana (Wagadu, aprox. segles IV–XIII), símbol d'una grandesa africana anterior a Europa, tot i que era més al nord-oest." },
    { a3: "MLI", from: ["Sudan Francès"], to: "Mali", y: 1960, why: "Recupera el nom de l'Imperi de Mali de Sundiata Keita i Mansa Musa (segles XIII–XVI)." },
    { a3: "ZWE", from: ["Rhodèsia", "Rhodèsia del Sud"], to: "Zimbabwe", y: 1980, why: "Del xona dzimba dza mabwe, «cases de pedra», per la ciutat medieval del Gran Zimbabwe. El nom colonial homenatjava Cecil Rhodes." },
    { a3: "ZMB", from: ["Rhodèsia del Nord"], to: "Zàmbia", y: 1964, why: "Pel riu Zambezi. Abandona també el nom de Cecil Rhodes." },
    { a3: "BFA", from: ["Alt Volta"], to: "Burkina Faso", y: 1984, why: "«País de les persones íntegres», combinant el mooré i el diula. El nom colonial era només una referència hidrogràfica." },
    { a3: "BEN", from: ["Dahomey"], to: "Benín", y: 1975, why: "Pel golf de Benín. El nou nom evitava identificar l'estat amb el regne fon de Dahomey, un dels molts pobles del país." },
    { a3: "MWI", from: ["Àfrica Central Britànica", "Niassalàndia"], to: "Malawi", y: 1964, why: "Per l'antic Imperi maravi (segles XV–XVIII)." },
    { a3: "BWA", from: ["Bechuanalàndia"], to: "Botswana", y: 1966, why: "«Terra dels tswana», en la seva pròpia llengua." },
    { a3: "LSO", from: ["Basutolàndia"], to: "Lesotho", y: 1966, why: "«Terra de la gent que parla sesotho»." },
    { a3: "SWZ", from: ["Swazilàndia"], to: "Eswatini", y: 2018, why: "El nom en siswati substitueix l'híbrid colonial anglès." },
    { a3: "COD", from: ["Estat Lliure del Congo", "Congo Belga", "Zaire"], to: "RD del Congo", y: 1997, why: "Pel riu i pel regne del Kongo. «Zaire» (1971–1997) venia d'una deformació portuguesa del kikongo nzere o nzadi, «riu»." },
    { a3: "TZA", from: ["Àfrica Oriental Alemanya", "Tanganyika", "Zanzíbar"], to: "Tanzània", y: 1964, why: "Unió de Tanganyika i Zanzíbar en un nom nou." },
    { a3: "CAF", from: ["Ubangui-Xari"], to: "República Centreafricana", y: 1960, why: "El nom colonial venia de dos rius; el nou, de la posició geogràfica." },
    { a3: "NAM", from: ["Àfrica del Sud-oest Alemanya", "Àfrica del Sud-oest"], to: "Namíbia", y: 1990, why: "Pel desert del Namib." },
    { a3: "GNQ", from: ["Fernando Póo", "Guinea Espanyola"], to: "Guinea Equatorial", y: 1968, why: "L'illa de Fernando Póo, batejada amb el nom d'un navegant portuguès, es diu avui Bioko." },
    { a3: "GNB", from: ["Guinea Portuguesa"], to: "Guinea Bissau", y: 1974, why: "Afegeix el nom de la capital per distingir-se de la Guinea veïna." },
    { a3: "DJI", from: ["Obock", "Somàlia Francesa", "Territori dels Àfars i els Issas"], to: "Djibouti", y: 1977, why: "Pren el nom de la ciutat portuària." },
    { a3: "SOM", from: ["Somàlia Italiana", "Somalilàndia Britànica"], to: "Somàlia", y: 1960, why: "Unió de dues colònies. Però milions de somalis van quedar fora, a Etiòpia, Kenya i Djibouti." },
    { a3: "ETH", from: ["Abissínia"], to: "Etiòpia", y: 1941, why: "«Abissínia» era l'exònim europeu (de l'àrab Habash). «Etiòpia» era el nom que l'estat utilitzava; l'ús internacional es generalitzà després de l'alliberament." },
    { a3: "CMR", from: ["Kamerun", "Camerun francès i britànic"], to: "Camerun", y: 1960, why: "El nom ve del portuguès Rio dos Camarões, «riu de les gambes»: és un nom colonial que s'ha mantingut." },
    { a3: "TGO", from: ["Togolàndia"], to: "Togo", y: 1960, why: "La Togolàndia alemanya va ser partida el 1919: la part occidental és avui dins de Ghana." },
    { a3: "RWA", from: ["Ruanda-Urundi"], to: "Ruanda i Burundi", y: 1962, why: "Bèlgica administrava junts dos regnes amb històries pròpies." },
    { a3: "NGA", from: ["Protectorats del Nord i del Sud"], to: "Nigèria", y: 1914, why: "Nom proposat el 1897 per la periodista britànica Flora Shaw a partir del riu Níger. L'amalgama de 1914 va unir societats molt diverses en un sol estat." },
    { a3: "CIV", from: ["Costa d'Ivori"], to: "Côte d'Ivoire", y: 1985, why: "Conserva el nom colonial del comerç d'ivori; des del 1985 el govern demana que no es tradueixi." },
    { a3: "SAH", from: ["Río de Oro", "Sàhara Espanyol"], to: "Sàhara Occidental", y: 1976, why: "Territori pendent de descolonització segons l'ONU. El Front Polisario hi proclamà la República Àrab Sahrauí Democràtica (1976)." }
  ];

  // Ciutats: nom colonial → nom actual
  const CITIES = [
    { lon: 15.31, lat: -4.32, old: "Léopoldville", now: "Kinshasa", y: 1966 },
    { lon: 25.19, lat: 0.52, old: "Stanleyville", now: "Kisangani", y: 1966 },
    { lon: 27.48, lat: -11.66, old: "Élisabethville", now: "Lubumbashi", y: 1966 },
    { lon: 18.26, lat: 0.05, old: "Coquilhatville", now: "Mbandaka", y: 1966 },
    { lon: 26.73, lat: -10.98, old: "Jadotville", now: "Likasi", y: 1966 },
    { lon: 28.86, lat: -2.51, old: "Costermansville", now: "Bukavu", y: 1966 },
    { lon: 29.19, lat: -5.95, old: "Albertville", now: "Kalemie", y: 1966 },
    { lon: 31.05, lat: -17.83, old: "Salisbury", now: "Harare", y: 1982 },
    { lon: 32.57, lat: -25.97, old: "Lourenço Marques", now: "Maputo", y: 1976 },
    { lon: 15.04, lat: 12.13, old: "Fort-Lamy", now: "N'Djamena", y: 1973 },
    { lon: -16.58, lat: 13.45, old: "Bathurst", now: "Banjul", y: 1973 },
    { lon: 8.78, lat: 3.75, old: "Santa Isabel", now: "Malabo", y: 1973 },
    { lon: 29.36, lat: -3.38, old: "Usumbura", now: "Bujumbura", y: 1962 },
    { lon: 15.74, lat: -12.78, old: "Nova Lisboa", now: "Huambo", y: 1975, n: ["cities7577"] },
    { lon: 13.49, lat: -14.92, old: "Sá da Bandeira", now: "Lubango", y: 1975, n: ["cities7577"] },
    { lon: 32.65, lat: -13.64, old: "Fort Jameson", now: "Chipata", y: 1967 },
    { lon: 28.88, lat: -11.2, old: "Fort Rosebery", now: "Mansa", y: 1967 },
    { lon: 31.37, lat: -8.84, old: "Abercorn", now: "Mbala", y: 1967 },
    { lon: 6.91, lat: 36.88, old: "Philippeville", now: "Skikda", y: 1962 },
    { lon: 7.77, lat: 36.9, old: "Bône", now: "Annaba", y: 1962 },
    { lon: 1.33, lat: 36.17, old: "Orléansville", now: "Chlef", y: 1981, n: ["chlef"] }
  ];

  // ---------------------------------------------------------------- Pobles partits
  // Noms tal com apareixen al mapa de Murdock (1959). g = agrupa tot el grup cultural.
  const STORIES = [
    { id: "Masai", label: "Massais", d: "Pastors de les sabanes del Rift. Els acords anglo-alemanys de 1886 i 1890 els van partir amb una línia recta entre Kenya i Tanzània, i les autoritats britàniques els van expulsar de les millors terres (1904–1911) per donar-les a colons." },
    { id: "Somali", g: true, label: "Somalis", d: "Un poble amb una llengua i una cultura comunes repartit entre colònies britàniques, italianes, franceses i l'Imperi etíop. Avui es troba dividit entre Somàlia, Somalilàndia, Etiòpia, Kenya i Djibouti." },
    { id: "Ewe", label: "Ewe", d: "Dividits primer entre la Costa d'Or britànica i la Togolàndia alemanya, i després de 1919 entre el Regne Unit i França. Avui, entre Ghana i Togo." },
    { id: "Kongo", label: "Bakongo", d: "Hereus del gran regne del Kongo, repartits entre Portugal, França i Leopold II en els tractats de 1884–1891. Avui, a Angola, la RD del Congo i la República del Congo." },
    { id: "Yoruba", label: "Ioruba", d: "Una de les grans civilitzacions urbanes de l'Àfrica occidental, dividida entre la Nigèria britànica i el Dahomey francès." },
    { id: "Hausa", label: "Haussa", d: "Les fronteres franco-britàniques traçades entre 1890 i 1906 van separar les ciutats estat haussa entre Nigèria i Níger." },
    { id: "Tuareg", g: true, label: "Amazics tuaregs", d: "Pobles nòmades del Sàhara per a qui les fronteres no tenien sentit. Avui viuen repartits entre Algèria, Líbia, Mali, Níger i Burkina Faso." },
    { id: "Chewa", label: "Chewa", d: "Hereus de l'Imperi maravi, repartits entre Malawi, Moçambic i Zàmbia per acords anglo-portuguesos (1891)." },
    { id: "Azande", label: "Azande", d: "Els regnes zande van quedar dividits entre l'Estat Lliure del Congo, el Sudan angloegipci i l'Àfrica Equatorial Francesa." },
    { id: "Fang", label: "Fang", d: "Repartits entre el Gabon francès, el Kamerun alemany i la Guinea Espanyola." },
    { id: "Afar", label: "Àfars", d: "Pastors de la depressió de Danakil, dividits entre Etiòpia, Eritrea i Djibouti." },
    { id: "Sotho", label: "Basotho", d: "Una part va quedar a Basutolàndia —avui Lesotho, un estat enclavat— i la resta a Sud-àfrica." },
    { id: "Malinke", label: "Malinkes (mandinga)", d: "Hereus de l'Imperi de Mali, avui repartits entre Mali, Guinea, el Senegal i Costa d'Ivori." },
    { id: "Nama", label: "Nama", d: "Supervivents del genocidi alemany de 1904–1908, dividits entre Namíbia i Sud-àfrica." }
  ];

  return { POWERS, COLONIAL, NOTES, COUNTRIES, P1880, P1914, EVENTS, RENAMES, CITIES, STORIES, START: 1870, END: 2018 };
})();
