/**
 * the difficulty is dependent on the used kana and the length of the words:
 * difficulty 1 (easy): only hiragana and 5 signs at max
 * difficulty 2 (medium): hiragana and katakana and 10 signs at max
 * difficulty 3 (hard): all kana and unlimited signs
 */
const vocabs = [
  { "Deutsch": "ja", "English": "yes", romaji: "hai", kana: "はい", difficulty: "1" },
  { "Deutsch": "nein", "English": "no", romaji: "iie", kana: "いいえ", difficulty: "1" },
  { "Deutsch": "bitte (beim Anbieten)", "English": "please (offering)", romaji: "douzo", kana: "どうぞ", difficulty: "1" }
];