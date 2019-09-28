const vocabs = [
  { deutsch: "ja", romaji: "hai", kana: "はい" },
  { deutsch: "nein", romaji: "iie", kana: "いいえ" },
  { deutsch: "bitte (beim Anbieten)", romaji: "douzo", kana: "どうぞ" }
];

function GlobalDict() {
  this.lang = "Deutsch";
  this.languages = languages;
  this.designs = {
    "design1": {
      link: "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"
    },
    "design2": {
      link: "css/bulmaswatch.darkly.min.css"
    },
    "design3": {
      link: "css/bulmaswatch.slate.min.css"
    }
  };
  this.page = 'mainMenu';
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
      return this.languages[this.lang][id];
    }
  }
});

var mainMenu = new Vue({
  el: '#mainMenu',
  data: gD,
  computed: {
    isSeen: function () {
      return this.page === 'mainMenu';
    }
  },
  methods: {
    getText: function (id) {
      return this.languages[this.lang][id];
    },
    navigateTo: function (id) {
      this.page = id;
    }
  }
});

var settings = new Vue({
  el: '#settings',
  data: gD,
  computed: {
    isSeen: function () {
      return this.page === 'settings';
    }
  },
  methods: {
    getText: function (id) {
      return this.languages[this.lang][id];
    },
    navigateTo: function (id) {
      this.page = id;
    },
    applySettings: function () {
      this.lang = document.getElementById('languageSelection').value;
      document.getElementById('bulmaCSS').href = this.designs[document.getElementById('themeSelection').value].link;
    }
  }
});