/* Content of the school edition: everything that is text, apart from the HTML and the map names.
 * Names of nations and places are spelled in several ways; these spellings are a first draft to check
 * with the Aboriginal and Torres Strait Islander organisations of each place. */
window.CONTENT = {
  // Chapter 1: some of the nations whose Country is under today's cities [nation, lon, lat, place, text]
  COUNTRY: [
    ["Gadigal", 151.21, -33.86, "Sydney", "One of the clans of the Eora people. The First Fleet landed on Gadigal Country, at Warrane (Sydney Cove)."],
    ["Wurundjeri and Bunurong", 144.96, -37.81, "Melbourne", "Peoples of the Kulin nation. Many people call the city Naarm."],
    ["Turrbal and Yuggera", 153.03, -27.47, "Brisbane", "The Brisbane area is often called Meanjin."],
    ["Whadjuk Noongar", 115.86, -31.95, "Perth", "Noongar Country covers the whole south-west of Western Australia. Perth is often called Boorloo."],
    ["Kaurna", 138.60, -34.93, "Adelaide", "Adelaide is Tarntanya in the Kaurna language, which is being brought back to life."],
    ["palawa", 147.33, -42.88, "Hobart", "The Aboriginal people of Tasmania. In palawa kani, Hobart is nipaluna and its mountain is kunanyi."],
    ["Larrakia", 130.84, -12.46, "Darwin", "Saltwater people of the Darwin area."],
    ["Ngunnawal", 149.13, -35.28, "Canberra", "The name Canberra is often said to come from a word of the local people."],
    ["Arrernte", 133.88, -23.70, "Alice Springs", "Mparntwe is the Arrernte name of Alice Springs."],
    ["Anangu", 131.04, -25.34, "Uluru", "Pitjantjatjara and Yankunytjatjara people. Uluru is part of their Tjukurpa: their law and their stories."],
    ["Yolŋu", 136.89, -12.23, "Yirrkala", "The clans of north-east Arnhem Land. Their bark paintings are maps of Country."],
    ["Gurindji", 130.83, -17.45, "Kalkaringi", "In 1966 the Gurindji walked off a cattle station to ask for their land back."],
    ["Wiradjuri", 147.37, -35.12, "Wagga Wagga", "The 'people of the three rivers', one of the largest nations of New South Wales."],
    ["Yawuru", 122.24, -17.96, "Broome", "Saltwater people of Roebuck Bay."],
    ["Kalkadoon", 139.49, -20.73, "Mount Isa", "Kalkadoon warriors fought the Native Police at Battle Mountain in 1884."],
    ["Meriam", 144.05, -9.92, "Mer (Murray Island)", "Torres Strait Islanders are a people of their own, with their own languages and culture, close to Papua."]
  ],

  // Chapter 2: the first lines [name, lon, lat, text]
  FIRST: [
    ["Kamay (Botany Bay)", 151.22, -34.00, "1770: James Cook's ship Endeavour anchors here. Gweagal men try to stop the strangers from landing."],
    ["Bedanug (Possession Island)", 142.39, -10.73, "22 August 1770: Cook claims the whole east coast for the British king, and calls it New South Wales. Nobody asked the Kaurareg people, whose island it is."],
    ["Warrane (Sydney Cove)", 151.21, -33.86, "26 January 1788: the First Fleet lands, with about 1,400 people, more than half of them convicts."]
  ],

  // Chapter 3: one continent claimed [name, lon, lat, text]
  WHOLE: [
    ["Albany", 117.88, -35.02, "1826: soldiers from Sydney make a camp at King George Sound, on Menang Noongar Country, to keep the French away."],
    ["Perth", 115.86, -31.95, "1829: the Swan River Colony is founded on Whadjuk Noongar Country. Britain now claims the whole continent."],
    ["Hobart", 147.33, -42.88, "1825: Van Diemen's Land, today Tasmania, becomes a colony of its own."]
  ],

  // Chapter 4: in 1850, which colony was this place in? [city, explanation]
  GUESS: [
    ["Melbourne", "Melbourne was the capital of the Port Phillip District of New South Wales. Victoria only separated in 1851."],
    ["Adelaide", "Adelaide was founded in 1836 as the capital of South Australia."],
    ["Brisbane", "Brisbane was in New South Wales. Queensland only separated in 1859."],
    ["Hobart", "Hobart was the capital of Van Diemen's Land."],
    ["Perth", "Perth was the capital of Western Australia."],
    ["Alice Springs", "On paper, this land west of 135° was part of New South Wales from 1825, but no colonist had been there yet."],
    ["Darwin", "On paper it was New South Wales. The British town of Palmerston, today Darwin, was only founded in 1869."],
    ["Port Augusta", "It was in South Australia, east of 132° East."]
  ],
  GUESS_OPTIONS: ["NSW_C", "VDL", "SA_C", "WA_C"],

  // Chapter 5: the frontier wars [name, lon, lat, years, text]
  FRONTIER: [
    ["Sydney", 151.0, -33.82, "1790–1802", "Pemulwuy, a Bidjigal man, led attacks against the colony for twelve years. Governor King called him a 'terrible pest'; his people remember a hero."],
    ["Bathurst", 149.58, -33.42, "1824", "Windradyne and Wiradjuri warriors fought settlers who took their land. The governor declared martial law."],
    ["Tasmania", 147.3, -42.0, "1824–1832", "In the 'Black War', hundreds of palawa people and settlers were killed. The survivors were sent to Flinders Island. Their descendants live in Tasmania today."],
    ["Pinjarra", 115.87, -32.63, "1834", "Soldiers and settlers led by Governor Stirling attacked a camp of Binjareb Noongar people and killed many of them."],
    ["Myall Creek", 150.62, -29.78, "1838", "Stockmen killed 28 Wirrayaraay women, children and old men. For the first time, seven of the killers were tried and hanged."],
    ["Battle Mountain", 140.25, -20.30, "1884", "Kalkadoon warriors fought settlers and the Native Police in one of the biggest battles of the frontier."],
    ["Windjana Gorge", 124.97, -17.41, "1894–1897", "Jandamarra, a Bunuba man, led a resistance war in the Kimberley for three years."],
    ["Coniston", 132.9, -22.05, "1928", "Police-led parties killed dozens of Warlpiri, Anmatyerr and Kaytetye people. It is one of the last known massacres."]
  ],

  // Chapter 9: standing up for Country [name, lon, lat, year, text]
  RIGHTS: [
    ["Yirrkala", 136.89, -12.23, "1963", "Yolŋu leaders sent the Yirrkala bark petitions to Parliament: they protested against a mine on their land, in their language and in English."],
    ["Wave Hill", 130.83, -17.45, "1966", "Vincent Lingiari led the Gurindji walk-off. In 1975 the Prime Minister, Gough Whitlam, poured a handful of soil into his hand: the land was returned."],
    ["Canberra", 149.13, -35.30, "1967–2008", "1967: more than 90% of voters say yes to count Aboriginal people in the census. 1972: the Aboriginal Tent Embassy. 2008: the government says sorry to the Stolen Generations."],
    ["Uluru", 131.04, -25.34, "1985", "Uluru is handed back to its Anangu owners, who lease it to the national park. In 2017 the Uluru Statement from the Heart is written here."],
    ["Mer (Murray Island)", 144.05, -9.92, "1992", "Eddie Koiki Mabo and other Meriam people won their case in the High Court: Australia had never been terra nullius, nobody's land."],
    ["Aurukun", 141.72, -13.35, "1996", "In the Wik case, the High Court decided that native title can exist on land leased to cattle stations."]
  ],

  // Your place through time: traditional owners of each city (see the note at the top)
  PLACE_COUNTRY: {
    "Sydney": "Gadigal (Eora)", "Melbourne": "Wurundjeri and Bunurong (Kulin)", "Brisbane": "Turrbal and Yuggera",
    "Perth": "Whadjuk Noongar", "Adelaide": "Kaurna", "Hobart": "muwinina (palawa)", "Darwin": "Larrakia",
    "Canberra": "Ngunnawal and Ngambri", "Alice Springs": "Arrernte", "Cairns": "Yidinji and Gimuy Walubara Yidinji",
    "Townsville": "Wulgurukaba and Bindal", "Broome": "Yawuru", "Uluru": "Anangu", "Newcastle": "Awabakal and Worimi",
    "Wollongong": "Dharawal", "Geelong": "Wadawurrung", "Ballarat": "Wadawurrung", "Launceston": "palawa",
    "Albany": "Menang Noongar", "Broken Hill": "Wilyakali", "Mount Isa": "Kalkadoon", "Katherine": "Jawoyn, Dagoman and Wardaman",
    "Tennant Creek": "Warumungu", "Coober Pedy": "Antakirinja Matu-Yankunytjatjara", "Port Augusta": "Barngarla, Nukunu and others",
    "Rockhampton": "Darumbal", "Thursday Island": "Kaurareg and Torres Strait Islanders", "Dubbo": "Wiradjuri",
    "Gold Coast": "Yugambeh (Kombumerri)", "Port Hedland": "Kariyarra", "Ceduna": "Wirangu and Far West Coast peoples",
    "Wagga Wagga": "Wiradjuri"
  },

  // Old names -> names of today
  FLIPS: [
    { ico: "🗺️", old: "New Holland", now: "Australia", y: 1824, why: "Dutch sailors called the west coast New Holland. Matthew Flinders preferred 'Australia', the southern land." },
    { ico: "🏝️", old: "Van Diemen's Land", now: "Tasmania", y: 1856, why: "After Abel Tasman, the first European to see the island, in 1642." },
    { ico: "🌊", old: "Port Phillip District", now: "Victoria", y: 1851, why: "After Queen Victoria, when it separated from New South Wales." },
    { ico: "🏛️", old: "Federal Capital Territory", now: "Australian Capital Territory", y: 1938, why: "The land around Canberra, taken from New South Wales in 1911." },
    { ico: "🪨", old: "Ayers Rock", now: "Uluru", y: 1993, why: "Uluru was named after a British politician in 1873. Since 1993 it has two names, and since 2002 Uluru comes first." },
    { ico: "⛰️", old: "The Olgas", now: "Kata Tjuta", y: 1993, why: "'Many heads' in Pitjantjatjara." },
    { ico: "🦩", old: "Lake Eyre", now: "Kati Thanda–Lake Eyre", y: 2012, why: "The Arabana name was added to the English one." },
    { ico: "🏔️", old: "Mount Wellington", now: "kunanyi / Mount Wellington", y: 2013, why: "The mountain above Hobart got back its palawa kani name, next to the English one." },
    { ico: "🐊", old: "Palmerston", now: "Darwin", y: 1911, why: "After Charles Darwin, whose ship Beagle had visited the harbour in 1839. The Larrakia name of the place is Garramilla." },
    { ico: "🐬", old: "Fraser Island", now: "K'gari", y: 2023, why: "'Paradise' in the language of the Butchulla people." }
  ],

  QUIZ: [
    { q: "How long have Aboriginal and Torres Strait Islander peoples lived in Australia?", a: ["About 250 years", "About 2,000 years", "More than 60,000 years"], ok: 2,
      why: "They have one of the oldest living cultures in the world. In 1788 there were more than 250 languages." },
    { q: "In 1788, where did the western border of New South Wales run?", a: ["Along a river", "Along the line of 135° East", "Along a mountain range"], ok: 1,
      why: "The line was drawn in London. No British person had ever been there." },
    { q: "What does 'terra nullius' mean?", a: ["Land of the king", "Nobody's land", "New land"], ok: 1,
      why: "The British acted as if the land belonged to nobody. In 1992 the Mabo decision said this was wrong." },
    { q: "Which colony was Melbourne in, in 1850?", a: ["Victoria", "New South Wales", "South Australia"], ok: 1,
      why: "Victoria only separated from New South Wales in 1851." },
    { q: "Why are so many borders of Australia straight lines?", a: ["Because the land is flat", "Because they were drawn with a ruler on a map, far away", "Because Aboriginal nations had straight borders"], ok: 1,
      why: "They follow lines of longitude and latitude. The Country of Aboriginal nations follows rivers, hills and waterholes." },
    { q: "What happened on 1 January 1901?", a: ["Federation: the colonies became one country", "The First Fleet arrived", "Canberra was founded"], ok: 0,
      why: "The six colonies became the six states of the Commonwealth of Australia." },
    { q: "What did Vincent Lingiari and the Gurindji people do in 1966?", a: ["They built a new town", "They walked off a cattle station to ask for their land back", "They sailed to London"], ok: 1,
      why: "The Wave Hill walk-off lasted almost nine years and led to the first land rights law." },
    { q: "Who was Eddie Koiki Mabo?", a: ["A Meriam man who proved in court that his people owned their land", "The first governor of Queensland", "An explorer who crossed the desert"], ok: 0,
      why: "The High Court agreed with him in 1992, a few months after he died." }
  ]
};
