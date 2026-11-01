/*
 * Content of the kids and teens version — English translation of js/infants-content.js.
 * Keep it in step with the Catalan original (same ids, years and answers).
 */
window.KIDS = {
  // id and g as in HISTORY.STORIES: name on Murdock's map or, with g, the whole cultural group
  STORIES: [
    { id: "Masai", ico: "🐄", label: "Maasai", d: "Herders who live with their herds of cattle on the savannah. In 1886 and 1890, the British and the Germans drew a straight line that left them split between Kenya and Tanzania." },
    { id: "Somali", g: true, ico: "⭐", label: "Somali", d: "They speak the same language but were split into five territories. The five-pointed star on Somalia's flag recalls those five pieces. Today they live in Somalia, Ethiopia, Kenya and Djibouti." },
    { id: "Kongo", ico: "👑", label: "Bakongo", d: "Heirs of the great Kingdom of Kongo. Portugal, France and King Leopold II shared it out among themselves. Today they live in Angola, DR Congo and the Republic of the Congo, and they speak Kikongo." },
    { id: "Ewe", ico: "🥁", label: "Ewe", d: "First the British and the Germans separated them, and after 1919, the British and the French. Today they live between Ghana and Togo." },
    { id: "Tuareg", g: true, ico: "🐪", label: "Tuareg", d: "Nomads of the Sahara Desert. For them borders made no sense at all, but now they have to cross a lot of them. They live in Algeria, Libya, Mali, Niger and Burkina Faso." },
    { id: "Chewa", ico: "🌽", label: "Chewa", d: "Heirs of the old Maravi Empire. An agreement between the British and the Portuguese in 1891 split them between Malawi, Mozambique and Zambia." }
  ],

  // [year, text]: shows the text of the last milestone on or before the slider's year
  MILESTONES: [
    [1950, "In 1950 only a few African countries were independent. South Africa doesn't count: a white minority was in charge there."],
    [1951, "1951: Libya becomes independent."],
    [1956, "1956: Sudan, Morocco and Tunisia."],
    [1957, "1957: Ghana, led by Kwame Nkrumah, becomes independent and inspires many other peoples."],
    [1958, "1958: Guinea says \"no\" to France and becomes independent."],
    [1960, "1960, the Year of Africa: seventeen countries become independent in a single year! 🎉"],
    [1961, "1961: Sierra Leone and Tanganyika (today Tanzania)."],
    [1962, "1962: Algeria, after a very hard war against France. Also Rwanda, Burundi and Uganda."],
    [1963, "1963: Kenya."],
    [1964, "1964: Malawi and Zambia."],
    [1975, "1975: Angola and Mozambique, after long wars against Portugal."],
    [1980, "1980: Zimbabwe, which used to be called Rhodesia."],
    [1990, "1990: Namibia."],
    [1993, "1993: Eritrea separates from Ethiopia."],
    [1994, "1994: apartheid ends and Nelson Mandela becomes the first president of South Africa chosen by everyone. ✊🏿"],
    [2011, "2011: South Sudan, the newest country in the world."]
  ],

  FLIPS: [
    { old: "Gold Coast", ico: "🪙", now: "Ghana", y: 1957, why: "It takes the name of a very old African empire, the Ghana Empire." },
    { old: "French Sudan", ico: "🇫🇷", now: "Mali", y: 1960, why: "It recalls the Mali Empire, where Mansa Musa reigned, a king famous for his riches." },
    { old: "Rhodesia", ico: "🎩", now: "Zimbabwe", y: 1980, why: "It means \"houses of stone\" in Shona. Rhodesia came from Cecil Rhodes, a British coloniser." },
    { old: "Upper Volta", ico: "🌊", now: "Burkina Faso", y: 1984, why: "It means \"land of upright people\", in other words, honest people." },
    { old: "Bechuanaland", ico: "🏜️", now: "Botswana", y: 1966, why: "\"Land of the Tswana\", in their own language." },
    { old: "Nyasaland", ico: "🏞️", now: "Malawi", y: 1964, why: "Named after the old Maravi Empire." },
    { old: "South West Africa", ico: "🧭", now: "Namibia", y: 1990, why: "Named after the Namib Desert, one of the oldest in the world." },
    { old: "Swaziland", ico: "🔤", now: "Eswatini", y: 2018, why: "\"Land of the Swazi\", in siSwati, their language, instead of a half-English name." }
  ],

  // ok = index of the right answer
  QUIZ: [
    { q: "How many African people were at the Berlin meeting?", a: ["Not a single one", "Five", "Fourteen"], ok: 0, why: "They divided up Africa without asking anyone who lived there." },
    { q: "Which two African countries were free in 1914?", a: ["Egypt and Morocco", "Ethiopia and Liberia", "Ghana and Mali"], ok: 1, why: "Ethiopia defeated Italy at Adwa, in 1896." },
    { q: "What does \"Zimbabwe\" mean?", a: ["Land of the river", "Free country", "Houses of stone"], ok: 2, why: "It comes from Shona and recalls the medieval city of Great Zimbabwe." },
    { q: "Why is 1960 called \"the Year of Africa\"?", a: ["Because seventeen countries became independent", "Because the Berlin meeting took place", "Because the borders were drawn"], ok: 0, why: "In a single year, seventeen African countries became independent." },
    { q: "How many languages are spoken in Africa?", a: ["About 50", "About 200", "More than 2,000"], ok: 2, why: "It is one of the places in the world with the most different languages." },
    { q: "Who was Yaa Asantewaa?", a: ["A queen mother who fought against the British", "A European explorer", "Ghana's first woman president"], ok: 0, why: "In 1900 she led the war to defend the Asante Golden Stool." }
  ]
};
