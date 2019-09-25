const vocabs = [
  { deutsch: "ja", romaji: "hai", kana: "はい" },
  { deutsch: "nein", romaji: "iie", kana: "いいえ" },
  { deutsch: "bitte (beim Anbieten)", romaji: "douzo", kana: "どうぞ" }
];

var status = new Vue({
  el: '#status',
  data: {
    scores: [
      {name: 'Punkte', number: 0},
      {name: 'Bla', number: 0},
      {name: 'Münzen', number: 0}
    ]
  }
});

var mainMenu = new Vue({
  el: '#mainMenu'
});