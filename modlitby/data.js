// ===== OBSAH APLIKÁCIE – tu sa upravujú texty =====

// V – Vyznávanie
const VYZNAVANIE = {
  uvod: {
    nadpis: "Moje vyznanie",
    text: [
      "Tu bude dlhší text vyznávania. Nahraď ho vlastným textom – každý odsek je jeden reťazec v zozname.",
      "Druhý odsek vyznania. Môžeš pridať ľubovoľný počet odsekov."
    ]
  },
  kategorie: [
    { nazov: "Kategória 1", text: ["Text kategórie 1."] },
    { nazov: "Kategória 2", text: ["Text kategórie 2."] },
    { nazov: "Kategória 3", text: ["Text kategórie 3."] }
  ]
};

// Katalóg prekladov: ZAKLAD = vždy predvyplnené pri novom verši
const PREKLADY = [
  { id: "ROH", nazov: "Roháčkov (pôvodný)", zaklad: true },
  { id: "EVJ", nazov: "Evanjelický", zaklad: true },
  { id: "SEB", nazov: "Ekumenický (SEB)", zaklad: true },
  { id: "BKR", nazov: "Bible kralická" },
  { id: "B21", nazov: "Bible 21" },
  { id: "ČSP", nazov: "Studijní překlad" },
  { id: "KJV", nazov: "King James (KJV)" }
];

// R – Rémy (verše vo viacerých prekladoch)
// Skratky prekladov: SEB, ROH, KJV ... (ľubovoľné)
const REMY = [
  {
    ref: "Ján 3,16",
    strong: [],
    preklady: {
      "ROH": "Lebo tak Boh miloval svet, že Syna svojho jednorodeného dal, aby každý, kto verí v neho, nezahynul, ale mal život večný.",
      "KJV": "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
    }
  }
];

// M – Modlitby (kategórie so slovami / slovnými spojeniami)
const MODLITBY = [
  { nazov: "Vďakyvzdanie", slova: ["vďaka", "chvála", "ďakujem ti"] },
  { nazov: "Prosby", slova: ["vedenie", "múdrosť", "ochrana"] },
  { nazov: "Príhovor", slova: ["rodina", "priatelia", "národ"] }
];
