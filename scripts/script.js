function GlobalDict() {
  this.lang = "Deutsch";
  this.languages = languages;
  this.design = "design1";
  this.designs = {
    "design1": {
      link: "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"
    },
    "design2": {
      link: "css/bulmaswatch.darkly.min.css"
    },
    "design3": {
      link: "css/bulmaswatch.slate.min.css"
    },
    "design4": {
      link: "css/bulmaswatch.solar.min.css"
    }
  };
  this.page = 'mainMenu';
  this.option = '';
  this.scores = {
    scores: [
      {id: 'statusLeft', number: 0},
      {id: 'statusMiddle', number: 0},
      {id: 'statusRight', number: 0}
    ]
  };
  this.saveData = function() {
    window.localStorage.setItem('globalDict', JSON.stringify({
      "lang": this.lang,
      "design": this.design,
      "scores": this.scores
    }));
  };
  this.loadData = function() {
    let data = JSON.parse(window.localStorage.getItem('globalDict'));
    if (data) {
      this.lang = data.lang;
      this.design = data.design;
      this.scores = data.scores;
      document.getElementById('bulmaCSS').href = this.designs[this.design].link;
    }
  }
}

const gD = new GlobalDict();
gD.loadData();

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
    navigateTo: function (id, option = '') {
      this.page = id;
      this.option = option;
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
      this.design = document.getElementById('themeSelection').value;
      document.getElementById('bulmaCSS').href = this.designs[this.design].link;
      this.saveData();
    }
  }
});

var selection = new Vue({
  el: '#selection',
  data: gD,
  computed: {
    isSeen: function () {
      return this.page === 'selection';
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