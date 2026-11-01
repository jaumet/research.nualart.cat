/*
 * Content of the language layers — English translation of js/languages.js.
 * Keep it in step with the Catalan original (same keys and categories).
 * Data for each language is in data/languages.js, generated from Glottolog.
 * Notes are appended to HISTORY.NOTES so that they are numbered after the others.
 */
window.LANGINFO = (() => {
  // Categories for official and administrative languages
  const CATS = {
    AFR: { name: "African languages", color: "#e3b23c" },
    AR:  { name: "Arabic", color: "#a8738f" },
    FR:  { name: "French", color: "#3d6cb3" },
    EN:  { name: "English", color: "#c23b32" },
    PT:  { name: "Portuguese", color: "#2f8a5b" },
    ES:  { name: "Spanish", color: "#e0892d" },
    DE:  { name: "German", color: "#5a5a5a" },
    IT:  { name: "Italian", color: "#3a9a9a" },
    NL:  { name: "Dutch", color: "#d36b8a" },
    AK:  { name: "Afrikaans", color: "#7d1d3f" },
    CR:  { name: "creole of colonial origin", color: "#6fc2b0" }
  };

  // [name, category, role] · role: "o" official (default) · "t" working language
  const L = (...rows) => rows;
  const NOW = {
    DZA: { l: L(["Arabic", "AR"], ["Amazigh (Tamazight)", "AFR"]) },
    AGO: { l: L(["Portuguese", "PT"]) },
    BEN: { l: L(["French", "FR"]) },
    BWA: { l: L(["English", "EN"]), n: ["lnational"] },
    BFA: { l: L(["national languages", "AFR"], ["French", "FR", "t"], ["English", "EN", "t"]), n: ["lsahel"] },
    BDI: { l: L(["Kirundi", "AFR"], ["French", "FR"], ["English", "EN"]) },
    CMR: { l: L(["French", "FR"], ["English", "EN"]) },
    CPV: { l: L(["Portuguese", "PT"]), n: ["lnational"] },
    CAF: { l: L(["French", "FR"], ["Sango", "AFR"]) },
    TCD: { l: L(["French", "FR"], ["Arabic", "AR"]) },
    COM: { l: L(["Comorian", "AFR"], ["French", "FR"], ["Arabic", "AR"]) },
    COG: { l: L(["French", "FR"]), n: ["lnational"] },
    COD: { l: L(["French", "FR"]), n: ["lnational"] },
    CIV: { l: L(["French", "FR"]) },
    DJI: { l: L(["French", "FR"], ["Arabic", "AR"]) },
    EGY: { l: L(["Arabic", "AR"]) },
    GNQ: { l: L(["Spanish", "ES"], ["French", "FR"], ["Portuguese", "PT"]) },
    ERI: { l: L(["Tigrinya", "AFR", "t"], ["Arabic", "AR", "t"], ["English", "EN", "t"]), n: ["leri"] },
    SWZ: { l: L(["siSwati", "AFR"], ["English", "EN"]) },
    ETH: { l: L(["Amharic, Oromo, Tigrinya, Somali and Afar", "AFR", "t"]), n: ["leth"] },
    GAB: { l: L(["French", "FR"]) },
    GMB: { l: L(["English", "EN"]) },
    GHA: { l: L(["English", "EN"]) },
    GIN: { l: L(["French", "FR"]) },
    GNB: { l: L(["Portuguese", "PT"]) },
    KEN: { l: L(["Swahili", "AFR"], ["English", "EN"]) },
    LSO: { l: L(["Sesotho", "AFR"], ["English", "EN"]) },
    LBR: { l: L(["English", "EN"]) },
    LBY: { l: L(["Arabic", "AR"]) },
    MDG: { l: L(["Malagasy", "AFR"], ["French", "FR"]) },
    MWI: { l: L(["English", "EN"]), n: ["lnational"] },
    MLI: { l: L(["13 national languages", "AFR"], ["French", "FR", "t"]), n: ["lsahel"] },
    MRT: { l: L(["Arabic", "AR"]) },
    MUS: { l: L(["English", "EN", "t"], ["French", "FR", "t"]), n: ["lmus"] },
    MAR: { l: L(["Arabic", "AR"], ["Amazigh (Tamazight)", "AFR"]) },
    MOZ: { l: L(["Portuguese", "PT"]) },
    NAM: { l: L(["English", "EN"]) },
    NER: { l: L(["Hausa (national language)", "AFR"], ["French", "FR", "t"], ["English", "EN", "t"]), n: ["lsahel"] },
    NGA: { l: L(["English", "EN"]) },
    RWA: { l: L(["Kinyarwanda", "AFR"], ["French", "FR"], ["English", "EN"], ["Swahili", "AFR"]) },
    STP: { l: L(["Portuguese", "PT"]) },
    SEN: { l: L(["French", "FR"]), n: ["lnational"] },
    SYC: { l: L(["Seychellois Creole", "CR"], ["English", "EN"], ["French", "FR"]) },
    SLE: { l: L(["English", "EN"]) },
    SOM: { l: L(["Somali", "AFR"], ["Arabic", "AR"]) },
    SOL: { l: L(["Somali", "AFR"], ["Arabic", "AR"], ["English", "EN"]) },
    ZAF: { l: L(["9 African languages", "AFR"], ["English", "EN"], ["Afrikaans", "AK"]), n: ["lzaf"] },
    SDN: { l: L(["Arabic", "AR"], ["English", "EN"]) },
    SDS: { l: L(["English", "EN"]) },
    TZA: { l: L(["Swahili", "AFR"], ["English", "EN"]) },
    TGO: { l: L(["French", "FR"]) },
    TUN: { l: L(["Arabic", "AR"]) },
    UGA: { l: L(["English", "EN"], ["Swahili", "AFR"]) },
    SAH: { l: L(["Arabic", "AR"]), n: ["lsah"] },
    ZMB: { l: L(["English", "EN"]) },
    ZWE: { l: L(["14 African languages", "AFR"], ["English", "EN"]), n: ["lzwe"] }
  };

  // National or recognised languages (not official), according to the Wikipedia list
  // "List of official languages by country and territory" (consulted November 2026)
  const NATIONAL = {
    AGO: "Kimbundu, Umbundu, Kikongo, Chokwe, Kwanyama, Ganguela",
    BWA: "Setswana (national)",
    CPV: "Cape Verdean Creole",
    CMR: "regional languages (Grassfields, Beti, Fulfulde, Hausa…)",
    COD: "Kikongo (Kituba), Lingala, Swahili, Tshiluba",
    COG: "Lingala, Munukutuba (Kituba)",
    GMB: "Mandinka, Pulaar, Wolof, Serer, Jola, Balanta, Soninke",
    GHA: "Fante, Twi, Ewe, Ga and other regional languages",
    GIN: "Fula, Maninka, Susu",
    MWI: "Chichewa",
    MRT: "Pulaar, Soninke, Wolof",
    NAM: "Afrikaans, German, Oshiwambo (regional)",
    NER: "Arabic, Fulfulde, Gulmancema, Kanuri, Zarma, Tamazight",
    NGA: "Hausa, Yoruba, Igbo",
    SEN: "Jola-Fonyi, Mandinka, Pulaar, Serer, Soninke, Wolof",
    SLE: "Krio",
    SDS: "Bari, Dinka, Luo, Murle, Nuer, Zande and some 60 more",
    ETH: "regional languages (Benishangul, Gumuz, Harari, Kunama, Sidamo…)"
  };

  // Language of the colonial administration around 1914 (units of GEO.p1914)
  const Y1914 = {
    "Morocco": L(["French", "FR"], ["Arabic", "AR"]), "Spanish Morocco": L(["Spanish", "ES"], ["Arabic", "AR"]), "Spanish Sahara": L(["Spanish", "ES"]),
    "Algeria": L(["French", "FR"]), "Tunisia": L(["French", "FR"], ["Arabic", "AR"]), "Libya": L(["Italian", "IT"]),
    "Egypt": L(["Arabic", "AR"], ["English", "EN"]), "Anglo-Egyptian Sudan": L(["English", "EN"], ["Arabic", "AR"]),
    "Eritrea": L(["Italian", "IT"]), "Abyssinia": L(["Amharic", "AFR"]), "Djibouti": L(["French", "FR"]),
    "British Somaliland": L(["English", "EN"]), "Italian Somaliland": L(["Italian", "IT"]),
    "British East Africa": L(["English", "EN"]), "Uganda": L(["English", "EN"]),
    "German East Africa": L(["German", "DE"], ["Swahili", "AFR"]),
    "Belgian Congo": L(["French", "FR"]), "Angola": L(["Portuguese", "PT"]), "Mozambique": L(["Portuguese", "PT"]),
    "Nyasaland": L(["English", "EN"]), "Rhodesia": L(["English", "EN"]), "Bechuanaland": L(["English", "EN"]),
    "German South-West Africa": L(["German", "DE"]), "Union of South Africa": L(["English", "EN"], ["Dutch", "NL"]),
    "Basutoland": L(["English", "EN"]), "Swaziland": L(["English", "EN"]), "Madagascar": L(["French", "FR"]),
    "Kamerun": L(["German", "DE"]), "French Equatorial Africa": L(["French", "FR"]), "Nigeria": L(["English", "EN"]),
    "French West Africa": L(["French", "FR"]), "Togoland": L(["German", "DE"]), "Gold Coast": L(["English", "EN"]),
    "Gambia": L(["English", "EN"]), "Portuguese Guinea": L(["Portuguese", "PT"]), "Sierra Leone": L(["English", "EN"]),
    "Liberia": L(["English", "EN"]), "Spanish Guinea": L(["Spanish", "ES"]), "Cape Verde": L(["Portuguese", "PT"]),
    "Sao Tome": L(["Portuguese", "PT"]), "Mauritius": L(["English", "EN"]), "Seychelles": L(["English", "EN"])
  };
  const Y1914_NOTES = { "German East Africa": ["l1914"], "Union of South Africa": ["l1914za"], "Liberia": ["lbr"], "Abyssinia": ["eth"] };

  // Family groups (see build/build_languages.py)
  const GROUPS = {
    ac: { name: "Atlantic-Congo (includes Bantu)", color: "#4fae63" },
    nc: { name: "Mande, Kru, Dogon, Ijoid", color: "#a7d36a" },
    aa: { name: "Afroasiatic (Arabic, Amazigh, Hausa, Somali…)", color: "#e8a23c" },
    ns: { name: "Nilotic, Sudanic and Saharan (\"Nilo-Saharan\")", color: "#a27bd6" },
    ks: { name: "Khoe, Tuu, Kx'a, Hadza, Sandawe (\"Khoisan\")", color: "#ec6a98" },
    an: { name: "Austronesian (Malagasy)", color: "#4cb3e6" },
    co: { name: "Contact languages (creoles, pidgins, Afrikaans)", color: "#f1f1f1" },
    ot: { name: "Other families and isolates", color: "#8d8d8d" }
  };
  const AES = {
    0: { name: "status unknown", color: "#6f6a64" },
    1: { name: "not endangered", color: "#5f7f66" },
    2: { name: "threatened", color: "#d8c35a" },
    3: { name: "endangered", color: "#e39b3a" },
    4: { name: "severely endangered", color: "#e0662f" },
    5: { name: "nearly extinct", color: "#d0352b" },
    6: { name: "extinct", color: "#111111" }
  };

  // Stories of languages that have disappeared or are about to (name as in Glottolog)
  const STORIES = [
    { id: "/Xam", label: "ǀXam", n: ["s_xam"], d: "Language of the San of the interior of the Cape. Colonial commandos of the 18th and 19th centuries exterminated or enslaved most of its speakers. Between 1870 and 1884, Wilhelm Bleek and Lucy Lloyd recorded thousands of pages from ǀXam prisoners held at the Breakwater convict station in Cape Town. The motto on South Africa's coat of arms (2000), \"!ke e: ǀxarra ǁke\", is written in ǀXam: a language nobody speaks any more." },
    { id: "Korana", label: "Kora (!Ora)", n: ["s_kora"], d: "A Khoekhoe language of the Cape and the Gariep (Orange) River. Loss of land and colonial rule imposed Dutch and later Afrikaans; the last fluent speakers died towards the end of the 20th century. Today there are initiatives to revive it." },
    { id: "N||ng", label: "Nǀuu", n: ["s_nuu"], d: "A Tuu language of the South African Kalahari. It was thought to be extinct until a few elderly speakers were found in the 1990s; very few remain today. The ǂKhomani were driven from their land when the Kalahari Gemsbok National Park was created (1931), and many had to hide their identity and their language." },
    { id: "Kwadi", label: "Kwadi", n: ["s_kwadi"], d: "Language of a people of herders and hunters in south-western Angola, distantly related to the Khoe languages. It was documented little and late; it is considered extinct." },
    { id: "Guanche", label: "Guanche", n: ["s_guanche"], d: "Language of the original inhabitants of the Canary Islands, probably related to the Amazigh (Berber) languages. The Castilian conquest (1402–1496), enslavement and epidemics wiped out its speakers; by the 17th century it was no longer spoken. Place names, a few words and inscriptions survive. It is one of the earliest cases of European colonisation in Africa." },
    { id: "Coptic", label: "Coptic", n: ["s_copt"], d: "The last stage of the language of the ancient Egyptians. After the Arab conquest (639–642) it was gradually replaced by Arabic; it stopped being spoken between the 16th and 17th centuries and is today the liturgical language of the Coptic Church. Language shift did not begin with European colonialism." },
    { id: "Meroitic", label: "Meroitic", n: ["s_mero"], d: "Language of the Kingdom of Kush in the period when its capital was Meroë (c. 3rd century BC – 4th century AD); centuries earlier, Kushite kings had ruled Egypt as the 25th Dynasty. Its script can be read, but the language is still only very partially understood. It died out around the 4th century." },
    { id: "Ongota", label: "Ongota", n: ["s_ongota"], d: "A language of southern Ethiopia kept alive only by a few elderly people; the community has adopted Ts'amakko, a neighbouring language. Pressure on small languages also comes from larger African languages." }
  ];

  const NOTES = {
    lpoints: "Glottolog places each language with a single point at the approximate centre of its area, and lists the countries where it is spoken. A point cannot represent a language spread across several countries (Kikongo, Swahili, Hausa…): that is why diversity is counted by country and not with points, which are only used for extinct or endangered languages, often very localised. Languages have no sharp borders: they share territory and overlap, and most people in Africa speak two or more. Source: H. Hammarström, R. Forkel, M. Haspelmath and S. Bank, <i>Glottolog</i> (Max Planck Institute for Evolutionary Anthropology), CC BY 4.0. Languages spoken as a first language and pidgins are included; sign languages are not.",
    lcountries: "Count based on the list of countries where Glottolog says each living language is spoken: a language spoken in Angola, DR Congo and the Congo counts in all three. Glottolog distinguishes varieties that are often considered a single language (for example, Kikongo appears as San Salvador Kongo, South-Central Koongo and Yombe), so the counts are indicative. Glottolog does not give speaker numbers: a high count does not mean a larger population.",
    lnationalsrc: "National or recognised languages: Wikipedia, \"List of official languages by country and territory\" (consulted November 2026), which refers to each state's constitution and laws.",
    lgroups: "Families are grouped to make the map easier to read. Glottolog only accepts proven families (Atlantic-Congo, Afroasiatic, Mande, Nilotic, etc.). \"Niger-Congo\" in the broad sense, \"Nilo-Saharan\" and \"Khoisan\" are hypotheses or groupings by J. Greenberg (1963) that many linguists do not regard as genetic families.",
    lcontact: "\"Contact languages\": creoles and pidgins. Most were born of trade, slavery and European colonisation (Krio, Cape Verdean Creole, Nigerian Pidgin, Seychellois Creole…), as was Afrikaans, derived from Dutch; a few have other origins (Arabic-based pidgins or recent pidgins from road-building sites). Glottolog classifies European-based creoles within the Indo-European family. Many are today fully fledged African languages, spoken by millions of people.",
    lextinct: "Glottolog gives the year of the last known documentation, which does not necessarily match the date of extinction. The causes of disappearance vary: colonial violence and dispossession (San and Khoekhoe languages in the south), but also replacement by larger African languages (Hausa, Amharic, Swahili…), urbanisation and, for the ancient languages, processes of centuries ago.",
    lstatus: "Vitality status according to Glottolog's <i>Agglomerated Endangerment Status</i>, which combines the EGIDS (Ethnologue), UNESCO and ElCat scales.",
    loff: "Official languages according to the constitutions in force in 2026. Official status does not reflect actual use: in many French- or English-speaking states only a minority speaks the official language fluently, while African lingua francas (Wolof, Bambara, Lingala, Swahili, Hausa…) are the most widely spoken.",
    lnational: "In many states (Senegal, Botswana, Malawi, DR Congo, Cape Verde…) African languages are recognised as \"national\", but the only official language is still the European one.",
    lsahel: "Constitution of Mali (2023), constitutional revision of Burkina Faso (December 2023, promulgated January 2024) and Charter of the Refoundation of Niger (March 2025): national languages become official (in Niger, Hausa is declared the \"national language\") and French remains a \"working language\", alongside English in Burkina Faso and Niger. In practice, French still dominates the administration and higher education.",
    leth: "In February 2020 the Council of Ministers announced Afaan Oromo, Tigrinya, Somali and Afar as federal working languages alongside Amharic; implementation is gradual.",
    leri: "Eritrea has no de jure official language; Tigrinya, Arabic and English are used as working languages.",
    lmus: "Mauritius has no de jure official language; English and French are used in parliament and the administration, but the most widely spoken language is Mauritian Creole.",
    lzaf: "South Africa has 12 official languages: 9 African languages (Zulu, Xhosa, Sepedi, Setswana, Sesotho, Xitsonga, siSwati, Tshivenda and isiNdebele), English, Afrikaans and, since 2023, South African Sign Language.",
    lzwe: "The constitution of Zimbabwe (2013) recognises 16 official languages, including English, Shona, Ndebele and sign language.",
    lsah: "In the territory administered by Morocco, Arabic and Amazigh apply; the Sahrawi Arab Democratic Republic has Arabic as its official language and also uses Spanish.",
    l1914gen: "Language of the colonial administration around 1914. In practice, many administrations also used African lingua francas: Hausa in northern Nigeria (indirect rule), Lingala and Kikongo in the army and administration of the Congo, Wolof in Senegal. Schooling in the European language reached a very small minority.",
    l1914: "The German administration of East Africa made wide use of Swahili, which helped it spread across the whole territory.",
    l1914za: "The constitution of the Union of South Africa (1910) made English and Dutch official; Afrikaans replaced Dutch in 1925. No African language was official.",
    s_xam: "Sources: Bleek and Lloyd collection (University of Cape Town; UNESCO Memory of the World Register, 1997); P. Skotnes, <i>Claim to the Country</i> (2007); M. Adhikari, <i>The Anatomy of a South African Genocide</i> (2010).",
    s_kora: "Glottolog dates its last documentation to 1985; the date of death of the last speakers is not precise. Source: M. du Plessis, <i>Kora: A Lost Khoisan Language of the Early Cape and the Gariep</i> (2018).",
    s_nuu: "Glottolog classifies it as \"nearly extinct\". The ǂKhomani community won a land claim in 1999. The exact number of living speakers varies between sources and has fallen quickly.",
    s_kwadi: "Glottolog dates its last documentation to around 1975. Data on the last speakers is scarce and the date of extinction is uncertain.",
    s_guanche: "Glottolog dates its documentation to between 1341 and 1650. Knowledge of the language is very fragmentary.",
    s_copt: "Glottolog dates its use to between the 3rd and 17th centuries. The exact date when it stopped being a mother tongue is disputed.",
    s_mero: "The Meroitic script was deciphered phonetically by F. Ll. Griffith (1909–1911), but its vocabulary and grammar are only partly understood.",
    s_ongota: "Glottolog classifies it as \"nearly extinct\"; its genetic classification is disputed."
  };
  Object.assign(window.HISTORY.NOTES, NOTES);

  // Common names of varieties that Glottolog separates (shown in brackets)
  const ALIAS = {
    "San Salvador Kongo": "Kikongo", "South-Central Koongo": "Kikongo", "Yombe": "Kikongo", "Suundi": "Kikongo", "Laari": "Kikongo",
    "Kituba (Congo)": "Kikongo", "Kituba (Democratic Republic of Congo)": "Kikongo", "Kinshasa Lingala": "Lingala", "Northwestern Lingala": "Lingala"
  };

  return { ALIAS, NATIONAL, CATS, NOW, Y1914, Y1914_NOTES, GROUPS, AES, STORIES };
})();
