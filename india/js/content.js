/* Content of the school edition: everything that is text, apart from the HTML and the map names. */
window.CONTENT = {
  // Scripts of Ashoka's edicts (point name -> script)
  SCRIPTS: {
    brahmi: { label: "Brahmi", note: "Most edicts are in Prakrit, written in Brahmi script. Brahmi is the ancestor of Devanagari, Bengali, Tamil, Telugu, Kannada, Sinhala and many other scripts." },
    kharosthi: { label: "Kharosthi", note: "In the north-west, near today's Peshawar, the edicts used Kharosthi, a script written from right to left." },
    greek: { label: "Greek and Aramaic", note: "In Kandahar, at the western edge of the empire, Ashoka wrote in Greek and Aramaic, the languages people there could read." }
  },
  EDICT_SCRIPT: { "Kandahar": "greek", "Shahbazgarhi": "kharosthi", "Mansehra": "kharosthi" },

  // Freedom struggle: [name, lon, lat, year, text]
  FREEDOM: [
    ["Kittur", 74.79, 15.60, "1824", "Rani Chennamma of Kittur led an army against the East India Company, more than 30 years before 1857."],
    ["Meerut", 77.71, 28.98, "1857", "On 10 May 1857 Indian soldiers rose up here. The revolt spread across northern and central India."],
    ["Jhansi", 78.57, 25.45, "1858", "Rani Lakshmibai of Jhansi fought the British on horseback and died in battle in 1858."],
    ["Ranchi", 85.31, 23.34, "1899", "Birsa Munda led the Ulgulan, the 'great tumult' of the Munda people, to defend their forests and land."],
    ["Champaran", 84.92, 26.65, "1917", "Mahatma Gandhi's first satyagraha in India, with farmers forced to grow indigo."],
    ["Amritsar", 74.88, 31.62, "1919", "On 13 April 1919 British troops fired on a peaceful crowd at Jallianwala Bagh and killed hundreds of people."],
    ["Lahore", 74.33, 31.55, "1929", "The Indian National Congress, led by Jawaharlal Nehru, called for Purna Swaraj: complete independence."],
    ["Dandi", 72.81, 20.89, "1930", "End of the Salt March. Soon after, Sarojini Naidu led a protest at the Dharasana salt works nearby."],
    ["Manipur hills", 93.75, 24.95, "1932", "Rani Gaidinliu, a Naga leader, was arrested at 16 and spent 15 years in prison."],
    ["Bombay", 72.81, 18.96, "1942", "On 8 August 1942 Gandhi asked the British to 'Quit India'. Aruna Asaf Ali raised the flag the next day."],
    ["Port Blair", 92.73, 11.67, "1906–1938", "The British sent many freedom fighters to the Cellular Jail, far away on the Andaman Islands."]
  ],
  SALT_MARCH: [[72.58, 23.06], [72.86, 22.69], [72.95, 22.56], [72.90, 22.41], [72.98, 22.05], [73.00, 21.70], [72.97, 21.40], [72.83, 21.17], [72.92, 20.95], [72.81, 20.89]],

  // Red or yellow? (city, answer, explanation)
  GUESS: [
    ["Jaipur", "prince", "Jaipur was the capital of a Rajput princely state."],
    ["Chennai", "brit", "Madras was the capital of the Madras Presidency."],
    ["Hyderabad", "prince", "Hyderabad was ruled by the Nizam, the richest of the princes."],
    ["Mysuru", "prince", "Mysore was ruled by the Wodeyar family."],
    ["Kolkata", "brit", "Calcutta was the capital of British India until 1911."],
    ["Thiruvananthapuram", "prince", "Trivandrum was the capital of Travancore."],
    ["Lucknow", "brit", "Lucknow was in the United Provinces. Its Nawab had been removed by the Company in 1856."],
    ["Srinagar", "prince", "Srinagar was in the princely state of Jammu and Kashmir."]
  ],

  // Old names -> new names
  FLIPS: [
    { ico: "🌊", old: "Bombay", now: "Mumbai", y: 1995, why: "From Mumba Devi, the goddess of the island's Koli fishing people." },
    { ico: "🏖️", old: "Madras", now: "Chennai", y: 1996, why: "From Chennapatnam, the town next to Fort St George." },
    { ico: "🛺", old: "Calcutta", now: "Kolkata", y: 2001, why: "The Bengali way of saying the city's name." },
    { ico: "🌳", old: "Bangalore", now: "Bengaluru", y: 2014, why: "The Kannada name of the city." },
    { ico: "🛕", old: "Madras State", now: "Tamil Nadu", y: 1969, why: "'Land of the Tamils'." },
    { ico: "🐘", old: "Mysore State", now: "Karnataka", y: 1973, why: "The land of the Kannada speakers." },
    { ico: "🌾", old: "Orissa", now: "Odisha", y: 2011, why: "Closer to the way the name is said in Odia." },
    { ico: "🦋", old: "Ceylon", now: "Sri Lanka", y: 1972, why: "'Resplendent island' in Sinhala." },
    { ico: "🌿", old: "East Pakistan", now: "Bangladesh", y: 1971, why: "'Country of the Bengalis', born after a war of independence." },
    { ico: "🏝️", old: "Laccadive Islands", now: "Lakshadweep", y: 1973, why: "'A hundred thousand islands' in Sanskrit and Malayalam." }
  ],

  QUIZ: [
    { q: "Why did Ashoka carve edicts on rocks and pillars?", a: ["To mark the borders of his empire", "To share his ideas about dhamma with his people", "To record the prices in the markets"], ok: 1,
      why: "He wanted people across the empire to read (or hear) his messages about kindness, honesty and respect. Today they also help us map his empire." },
    { q: "Which emperor died in 1707, when the Mughal Empire was at its biggest?", a: ["Akbar", "Shah Jahan", "Aurangzeb"], ok: 2,
      why: "Aurangzeb ruled for almost 50 years. After his death the empire quickly broke into pieces." },
    { q: "What was the British East India Company at first?", a: ["A trading company", "An army sent by the King", "A group of missionaries"], ok: 0,
      why: "It came to buy goods. It ended up with its own army and ruled most of the subcontinent until 1858." },
    { q: "On the map of 1909, what did the yellow areas show?", a: ["Deserts", "Princely states", "French colonies"], ok: 1,
      why: "More than 560 princely states had their own rulers, but under British control." },
    { q: "What happened to the partition of Bengal of 1905?", a: ["It became a new country", "It was undone in 1911 after huge protests", "Nothing, it is still there"], ok: 1,
      why: "The Swadeshi movement made the British put Bengal back together in 1911." },
    { q: "Who drew the border between India and Pakistan in 1947?", a: ["Mahatma Gandhi", "Cyril Radcliffe, a British lawyer", "The United Nations"], ok: 1,
      why: "Radcliffe drew it in about five weeks, without knowing the land well." },
    { q: "What was the main idea behind the new states of 1956?", a: ["Language", "Religion", "Rivers"], ok: 0,
      why: "The States Reorganisation Act of 1956 drew most states around a main language." },
    { q: "Which state was created most recently, in 2014?", a: ["Jharkhand", "Telangana", "Goa"], ok: 1,
      why: "Telangana was separated from Andhra Pradesh in 2014." }
  ],

  // Colours of the main languages (chapter 9) and of the categories of each era
  LANG_COLORS: {
    Hindi: "#f0c05a", Telugu: "#5fa3d6", Tamil: "#d0584f", Kannada: "#9a83cc", Malayalam: "#4fb3a6",
    Marathi: "#e98a3c", Gujarati: "#8cc36f", Punjabi: "#f39fb8", Bengali: "#3f7fc4", Odia: "#b45c8e",
    Assamese: "#6aa84f", Kashmiri: "#b4a7d6", "Meitei (Manipuri)": "#c79a64", Mizo: "#a3c4bc",
    Konkani: "#e7a07a", Ladakhi: "#c7b8a4", Nepali: "#9fb3c8", Khasi: "#b9d48c", other: "#c9c1ae"
  }
};
