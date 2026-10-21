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

// Zdroje pre tlačidlo „Nájsť“ v Správe. {q} = verš (napr. John+3:16), {slug}/{ch}/{v} pre BibleHub.
// Preklad bez vlastného zdroja sa hľadá cez internetové vyhľadávanie.
const ZDROJE = {
  KJV: "https://www.biblegateway.com/passage/?search={q}&version=KJV",
  B21: "https://www.biblegateway.com/passage/?search={q}&version=B21",
  SEB: "https://www.biblegateway.com/passage/?search={q}&version=SNC"
};
const ZDROJ_STRONG = "https://biblehub.com/interlinear/{slug}/{ch}-{v}.htm";

// Knihy: [číslo, BibleHub slug, anglický názov (BibleGateway), kľúče bez diakritiky]
const KNIHY = [
  [1,'genesis','Genesis',['genezis','genesis']],[2,'exodus','Exodus',['exodus']],[3,'leviticus','Leviticus',['levitikus','leviticus']],
  [4,'numbers','Numbers',['numeri','numbers']],[5,'deuteronomy','Deuteronomy',['deuteronomium']],
  [0,'joshua','Joshua',['jozue']],[0,'judges','Judges',['sudcov','sudcu','soudcu']],[0,'ruth','Ruth',['rut','ruth']],
  [1,'1_samuel','1 Samuel',['samuelova','samuel']],[2,'2_samuel','2 Samuel',['samuelova','samuel']],
  [1,'1_kings','1 Kings',['kralov','kralu']],[2,'2_kings','2 Kings',['kralov','kralu']],
  [1,'1_chronicles','1 Chronicles',['kronicka','paralipomenon','kronik']],[2,'2_chronicles','2 Chronicles',['kronicka','paralipomenon','kronik']],
  [0,'ezra','Ezra',['ezdras','ezra']],[0,'nehemiah','Nehemiah',['nehemias','nehemja']],[0,'esther','Esther',['ester']],
  [0,'job','Job',['job']],[0,'psalms','Psalms',['zalm','psalm','zalmy']],[0,'proverbs','Proverbs',['prislovia','prislovi']],
  [0,'ecclesiastes','Ecclesiastes',['kazatel','kazatele']],[0,'songs','Song of Solomon',['piesen','pisen']],
  [0,'isaiah','Isaiah',['izaias','izaiah']],[0,'jeremiah','Jeremiah',['jeremias','jeremjas']],[0,'lamentations','Lamentations',['plac']],
  [0,'ezekiel','Ezekiel',['ezechiel']],[0,'daniel','Daniel',['daniel']],[0,'hosea','Hosea',['ozeas','ozea']],[0,'joel','Joel',['joel']],
  [0,'amos','Amos',['amos']],[0,'obadiah','Obadiah',['abdias','abdias']],[0,'jonah','Jonah',['jonas','jonas']],
  [0,'micah','Micah',['miceas','micheas','micha']],[0,'nahum','Nahum',['nahum']],[0,'habakkuk','Habakkuk',['habakuk']],
  [0,'zephaniah','Zephaniah',['sofonias','sofonjas']],[0,'haggai','Haggai',['aggeus','agg']],[0,'zechariah','Zechariah',['zacharias','zacharjas']],
  [0,'malachi','Malachi',['malachias','malachi']],
  [0,'matthew','Matthew',['matus','matous']],[0,'mark','Mark',['marek']],[0,'luke','Luke',['lukas']],[0,'john','John',['jan']],
  [0,'acts','Acts',['skutky','skutku']],[0,'romans','Romans',['rimanom','rimanum','rim']],
  [1,'1_corinthians','1 Corinthians',['korintskym','korintanum','korint']],[2,'2_corinthians','2 Corinthians',['korintskym','korintanum','korint']],
  [0,'galatians','Galatians',['galatskym','galatanum','gal']],[0,'ephesians','Ephesians',['efezskym','efezanum','ef']],
  [0,'philippians','Philippians',['filipskym','filipanum','flp','fil']],[0,'colossians','Colossians',['kolosenskym','kolosanum','kol']],
  [1,'1_thessalonians','1 Thessalonians',['tesalonickym','tesalonicanum','tes']],[2,'2_thessalonians','2 Thessalonians',['tesalonickym','tesalonicanum','tes']],
  [1,'1_timothy','1 Timothy',['timotejovi','timoteovi','tim']],[2,'2_timothy','2 Timothy',['timotejovi','timoteovi','tim']],
  [0,'titus','Titus',['titovi','tit']],[0,'philemon','Philemon',['filemonovi','filem']],[0,'hebrews','Hebrews',['zidom','zidum','zid']],
  [0,'james','James',['jakub','jak']],[1,'1_peter','1 Peter',['petrova','petr']],[2,'2_peter','2 Peter',['petrova','petr']],
  [1,'1_john','1 John',['janova','jan']],[2,'2_john','2 John',['janova','jan']],[3,'3_john','3 John',['janova','jan']],
  [0,'jude','Jude',['judov','juda','jud']],[0,'revelation','Revelation',['zjavenie','zjeveni','zj']]
];
