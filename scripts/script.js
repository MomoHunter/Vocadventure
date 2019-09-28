const vocabs = [
  { deutsch: "ja", romaji: "hai", kana: "はい" },
  { deutsch: "nein", romaji: "iie", kana: "いいえ" },
  { deutsch: "bitte (beim Anbieten)", romaji: "douzo", kana: "どうぞ" }
];

function GlobalDict() {
  this.lang = "de";
  this.scores = {
    scores: [
      {id: 'statusLeft', number: 0},
      {id: 'statusMiddle', number: 0},
      {id: 'statusRight', number: 0}
    ]
  };
}

const gD = new GlobalDict();

var status = new Vue({
  el: '#status',
  data: gD,
  methods: {
    getText: function (id) {
      return languages[this.lang][id];
    }
  }
});

var mainMenu = new Vue({
  el: '#mainMenu',
  data: gD,
  methods: {
    getText: function (id) {
      return languages[this.lang][id];
    }
  }
});