const vocabs = [
  { deutsch: "ja", romaji: "hai", kana: "はい" },
  { deutsch: "nein", romaji: "iie", kana: "いいえ" },
  { deutsch: "bitte (beim Anbieten)", romaji: "douzo", kana: "どうぞ" }
];

function GlobalDict() {
  this.scores = {
    scores: [
      {name: 'Punkte', number: 0},
      {name: 'Test', number: 0},
      {name: 'Münzen', number: 0}
    ]
  };
}

const gD = new GlobalDict();

var status = new Vue({
  el: '#status',
  data: gD.scores
});

var mainMenu = new Vue({
  el: '#mainMenu'
});