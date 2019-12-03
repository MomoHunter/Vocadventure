/**
 * the difficulty is dependent on the used kana and the length of the words:
 * difficulty 1 (easy): only hiragana and 5 signs at max
 * difficulty 2 (medium): hiragana and katakana and 10 signs at max
 * difficulty 3 (hard): all kana and unlimited signs
 */
const vocabs = [
  { "Deutsch": "Ja", "English": "yes", romaji: "hai", kana: "はい", difficulty: "1" },
  { "Deutsch": "Nein", "English": "no", romaji: "iie", kana: "いいえ", difficulty: "1" },
  { "Deutsch": "Bitte (beim Anbieten)", "English": "please (offering)", romaji: "douzo", kana: "どうぞ", difficulty: "1" },
  { "Deutsch": "Danke", "English": "Thanks", romaji: "doumo", kana: "どうも", difficulty: "1" },
  { "Deutsch": "Heute", "English": "Today", romaji: "kyou", kana: "今日", difficulty: "3" },
  { "Deutsch": "Morgen", "English": "Tomorrow", romaji: "ashita", kana: "明日", difficulty: "3" },
  { "Deutsch": "Übermorgen", "English": "The day after tomorrow", romaji: "asatte", kana: "あさって", difficulty: "1" },
  { "Deutsch": "Ferse", "English": "heel", romaji: "kakato", kana: "かかと", difficulty: "1" },
  { "Deutsch": "Zucker (neutral)", "English": "sugar (neutral)", romaji: "satou", kana: "砂糖", difficulty: "3" },
  { "Deutsch": "Zucker (höflich)", "English": "sugar (polite)", romaji: "o-satou", kana: "お砂糖", difficulty: "3" },
  { "Deutsch": "Honig", "English": "honey", romaji: "hachimitsu", kana: "蜂蜜", difficulty: "3" }
];