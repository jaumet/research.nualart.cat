/*
 * Africa Carved Up, English school edition: what changes with the reader's age (see gem-age.js).
 * File in the Gem root js/, loaded by en/index.html. Bands: 1 = 3–5, 2 = 6–9, 3 = 10–12 (the page as written), 4 = 13–18.
 */
window.GEM_AGES = {
  simplify: "1 2",
  show: {
    ".hero-text > p.word": "3",
    "#cap6": "2 3 4",
    "#cap7 .cards": "2 3 4",
    "#cap8 > .callout": "2 3 4",
    "#cap8 .indep-caption": "2 3 4",
    "#paraules": "2 3 4",
    "#pensa .card.q": "2 3 4"
  },
  add: [
    [".hero-text > p.word", "after", "1", `<p class="word kid">This is the story of <strong>Africa</strong>, a very big continent, and of how some countries in Europe cut it into pieces. 🌍✂️</p>`],
    [".hero-text > p.word", "after", "2", `<p class="word"><strong>To carve up</strong> means to cut something into pieces. That's what a few European countries did with Africa. But African peoples fought back!</p>`],
    [".hero-text > p.word", "after", "4", `<p class="word"><strong>To carve up</strong> means to cut into pieces and share out. Between 1880 and 1914, seven European powers shared out almost the whole African continent. You will see how they did it, what it cost, how people resisted and which wounds are still open. And you will learn to read a map critically: who made it, with what data, and what for.</p>`],
    ["#pensa .cards-q", "start", "1", `<article class="card q"><span class="ico" aria-hidden="true">🍰</span><p>If someone eats the whole cake without asking, how do you feel?</p></article><article class="card q"><span class="ico" aria-hidden="true">👵🏿</span><p>How would you feel if you couldn't go and see your grandparents?</p></article>`],
    ["#pensa .cards-q", "end", "4", `<article class="card q"><span class="ico" aria-hidden="true">🏛️</span><p>Many European museums keep objects taken from Africa, like the Benin Bronzes. Should they give them back? All of them? To whom?</p></article><article class="card q"><span class="ico" aria-hidden="true">📚</span><p>Who tells the story in your history books? Are there African voices in them? How could you check?</p></article><article class="card q"><span class="ico" aria-hidden="true">🧭</span><p>If you could redraw Africa's borders, would you? What new problems might it create?</p></article>`],
    ["#paraules .glossary", "end", "4", `<div><dt><span aria-hidden="true">📍</span> Effective occupation</dt><dd>A rule of the Berlin Conference: to keep a stretch of African coast it was not enough to claim it; a power had to occupy it and tell the others.</dd></div><div><dt><span aria-hidden="true">💼</span> Neocolonialism</dt><dd>When a country is independent but a former power or big companies still control its economy or its politics.</dd></div><div><dt><span aria-hidden="true">🧾</span> Reparations</dt><dd>Making up for a past harm: returning objects, an official apology, payments or new laws.</dd></div>`],
    ["#mestres h2", "after", "1 2 3 4", `<p><strong>The age slider.</strong> At the top there is a slider with four ages. It is the same story, the same map and the same games, but the text changes: 🧸 3–5, one or two sentences per chapter, big letters and pictures, without the darkest chapter or the glossary; 🎒 6–9, short sentences and the dark part told with great care; 📘 10–12, the usual school edition; 🎓 13–18, more context, names and dates, debates and critical-thinking questions. The quiz changes too. Readers can switch at any time without losing their place, and <code>?age=1</code> to <code>?age=4</code> in the address opens a given age.</p>`]
  ],
  chapters: {
    "#cap1": {
      hide: "> p:not(.chap-n):not(.try):not([id]), > ul, > .callout",
      pic: { 1: "👑🏰🐫" },
      1: "A long, long time ago, Africa had <strong>kings and queens</strong>, cities and markets full of people.",
      2: "About 150 years ago, Africa had many <strong>kingdoms</strong>, with their own kings and queens, laws and markets. Some were famous for gold, others for books or for the camel caravans that crossed the desert. The sand-coloured areas weren't empty: many peoples lived there.",
      4: "On European maps of the time, inland Africa was a «blank space». But the fact that <em>they</em> didn't know it doesn't mean it was empty: Timbuktu held thousands of manuscripts on astronomy, law and medicine, and the Swahili cities on the east coast had traded with India and China for centuries."
    },
    "#cap2": {
      hide: "> p:not(.chap-n):not([id]), > .big-numbers",
      pic: { 1: "🥁🎶🐄🌽" },
      1: "<strong>Lots and lots of peoples</strong> lived there. Each people has its own language, its own songs and its own festivals.",
      2: "Each little piece of this map is a <strong>people</strong>: a group who share a language, festivals and stories. There were herders, farmers, fishers, blacksmiths and musicians, and more than 2,000 languages. And <strong>the land was theirs</strong>.",
      4: "<strong>Critical thinking.</strong> Be careful with labels. Many of these «tribe» names were fixed by colonial officials and anthropologists who needed to sort people in order to rule them. In real life identities mixed: people spoke two languages, married into the next people or changed group. A map with sharp lines between peoples is partly a simplification too."
    },
    "#cap3": {
      hide: "> p:not(.chap-n):not([id]), > .callout",
      pic: { 1: "🧔🏻📏🗺️" },
      1: "One day, some men from Europe met in a room far away from Africa and drew <strong>lines on the map</strong>. They didn't ask the people who lived there! 😮 Now you draw a line on the map with your finger.",
      2: "In 1884, people from <strong>14 countries</strong> met in Berlin, in Germany, to share out Africa. How many Africans were in the room? <strong>Not one.</strong> Later they drew borders with a <strong>ruler and pencil</strong>, often without ever having been there.",
      4: "The conference was called by the German chancellor Otto von Bismarck. A key agreement was the principle of <strong>effective occupation</strong>: to claim a coast, a power had to really occupy it. This sped up the race to conquer the continent, the <em>Scramble for Africa</em>. The conference also recognised the Congo Free State, which was in fact the private property of King Leopold II of Belgium."
    },
    "#cap4": {
      hide: "> p:not(.chap-n):not([id]), > .callout",
      pic: { 1: "🍰😠" },
      1: "In the end, a few countries from Europe took <strong>almost all of Africa</strong>. As if some children ate the whole cake and left none for the others! Only two countries stayed free: Ethiopia ⭐ and Liberia ⭐.",
      2: "In only <strong>30 years</strong>, seven European countries took almost the whole continent, often with wars. Only two countries stayed free: <strong>Ethiopia</strong> ⭐ and <strong>Liberia</strong> ⭐. Imagine seven kids from another school sharing out your desks and your playground. Unfair, isn't it?",
      4: "The seven powers were France, Britain, Germany, Belgium, Portugal, Italy and Spain, which held the protectorate of northern Morocco, Western Sahara and Spanish Guinea, today Equatorial Guinea. Such a fast conquest was possible thanks to new weapons, like the Maxim machine gun, and to quinine, which protected European soldiers from malaria."
    },
    "#cap5": {
      pic: { 1: "👵🏿 〰️ 👧🏿" },
      1: "The lines <strong>split families</strong>: grandma in one country, the grandchildren in another. Tap a people to meet them:",
      2: "The new borders cut many peoples in half. Families and friends ended up in different countries. Tap a people to learn their story:",
      4: `<div class="ga-debate"><p><strong>⚖️ A real dilemma.</strong> When the countries became independent, the Organisation of African Unity decided in Cairo, in 1964, to <strong>keep the borders inherited</strong> from colonial rule. Why? To avoid endless wars over where each country began. It was a practical decision, but it also made the wounds permanent. How would you have voted?</p></div>`
    },
    "#cap6": {
      hide: "> ul",
      2: `<ul class="facts"><li><span class="ico" aria-hidden="true">⚒️</span><span>The colonisers forced many people to <strong>work without pay</strong>, took their land and punished very harshly anyone who didn't obey. Many people died.</span></li><li><span class="ico" aria-hidden="true">🏫</span><span>In many schools, children were punished for <strong>speaking their own language</strong>.</span></li></ul>`,
      4: "<strong>How do we know?</strong> Partly thanks to people who spoke out. In 1904 the diplomat Roger Casement published a report on the abuses in the Congo, and the journalist Edmund D. Morel led a big international campaign. In 1908 Belgium took the Congo away from the king, but kept it as a colony until 1960. <strong>An open wound:</strong> in 2021 Germany recognised the genocide of the Herero and Nama and promised 1.1 billion euros in projects over 30 years. Many Herero and Nama representatives rejected it: they said they had not been allowed to take part in the talks and that reparations were not on the table."
    },
    "#cap7": {
      pic: { 1: "✊🏿✊🏾✊🏽" },
      1: "But many peoples said <strong>NO!</strong> and defended their land. In Ethiopia they won, and stayed free. 🎉",
      2: "Everywhere, there were people who fought to defend their land and their freedom.",
      4: "<strong>More resistance.</strong> In the Rif, in northern Morocco, Abd el-Krim defeated the Spanish army at Annual in 1921 and set up a republic that held out against Spain and France until 1926. In today's Zimbabwe, Charwe Nyakasikana, known as Nehanda, a Shona spirit medium, inspired the 1896–1897 uprising against the British. She was executed in 1898 and is a national symbol today."
    },
    "#cap8": {
      1: "After many years, African peoples were <strong>free</strong> again. Press the button and watch the map turn gold! ✨",
      2: "About 70 years ago, African peoples asked to be free, and one by one they became <strong>independent</strong>. Press the button and watch the map turn gold!",
      4: "It was no gift. In Algeria (1954–1962), in Kenya with the Mau Mau uprising (1952–1960) and in the Portuguese colonies (1961–1974) there were long and very hard wars. And political independence did not always bring economic independence: Kwame Nkrumah, Ghana's first president, called <em>neocolonialism</em> the control that former powers and big companies kept over African economies."
    },
    "#cap9": {
      hide: "> p:not(.chap-n):not([id]), > .big-numbers",
      pic: { 1: "🗣️💬" },
      1: "In Africa people speak <strong>lots and lots of languages</strong>: more than two thousand! In Swahili, «hello» is <strong>jambo</strong>. How do you say it at home?",
      2: "More than <strong>2,000 languages</strong> are spoken in Africa. But in many countries children study at school in French, English or Portuguese, the languages of the former colonisers. Good news: Swahili is official in Tanzania and Kenya, and more and more schools teach in African languages.",
      4: `<div class="ga-debate"><p><strong>⚖️ A debate between writers.</strong> The Kenyan Ngũgĩ wa Thiong'o stopped writing novels in English and switched to Gĩkũyũ, his own language: he said the colonial language colonises the way you think too (<em>Decolonising the Mind</em>, 1986). The Nigerian Chinua Achebe, on the other hand, argued that English could be made one's own to tell African stories. Who do you think is right? Can both be right?</p></div>`
    }
  }
};
