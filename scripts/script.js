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
  this.vocabs = vocabs;
  this.page = 'mainMenu';
  this.option = '';
  this.difficulty = '';
  this.wordCount = 0;
  this.vocabWords = [];
  this.currentWord = 0;
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
      if (id === 'mainMenu') {
        this.selectDifficulty(this.difficulty);
        this.selectCount(this.wordCount);
        this.option = '';
        this.currentWord = 0;
      }
      this.page = id;
    },
    selectDifficulty: function (number) {
      if (number !== '') {
        document.getElementById('difficulty' + number).classList.remove('is-outlined');
      }
      if (this.difficulty !== '') {
        document.getElementById('difficulty' + this.difficulty).classList.add('is-outlined');
        if (this.difficulty === number) {
          this.difficulty = '';
        } else {
          this.difficulty = number;
        }
      } else {
        this.difficulty = number;
      }
    },
    selectCount: function (number) {
      if (number !== 'Custom' && number !== 0) {
        document.getElementById('count' + number).classList.remove('is-outlined');
      }
      if (this.wordCount !== 0 && this.wordCount !== 'Custom') {
        document.getElementById('count' + this.wordCount).classList.add('is-outlined');
        if (this.wordCount === number) {
          this.wordCount = 0;
        } else {
          this.wordCount = number;
        }
      } else {
        this.wordCount = number;
      }
    },
    start: function () {
      this.vocabWords = [];

      if (this.wordCount === 0) {
        let wordCounts = [10, 20, 50, 100, 200, 500, 'All'];
        this.selectCount(wordCounts[Math.floor(Math.random() * wordCounts.length)]);
      }
      if (this.difficulty === '') {
        this.selectDifficulty((Math.floor(Math.random() * 3) + 1).toString());
      }

      if (this.wordCount === 'All') {
        this.vocabs.map(vocab => {
          if (+vocab.difficulty <= +this.difficulty) {
            this.vocabWords.push(vocab);
          }
        }, this);
      } else {
        let maxWords = this.wordCount === 'Custom' ? +document.getElementById('countCustom').value : this.wordCount;
        for (let i = 0; this.vocabWords.length < maxWords; i++) {
          let word = this.vocabs[Math.floor(Math.random() * this.vocabs.length)];
          if (+word.difficulty <= +this.difficulty) {
            if (this.vocabWords.length === 0) {
              this.vocabWords.push(word);
            } else if (this.vocabWords[this.vocabWords.length - 1] !== word) {
              this.vocabWords.push(word);
            }
          }
        }
      }
      this.page = this.option;
    }
  }
});

var training = new Vue({
  el: '#training',
  data: gD,
  computed: {
    isSeen: function () {
      return this.page === 'training';
    },
    isInTraining: function () {
      return this.currentWord > 0;
    },
    finishedTraining: function () {
      return this.currentWord < this.vocabWords.length;
    },
    getProgress: function () {
      return this.currentWord / this.vocabWords.length;
    },
    getProgressText: function () {
      return this.currentWord + " / " + this.vocabWords.length;
    }
  },
  methods: {
    getText: function (id) {
      switch (id) {
        case 'difficultyTag':
          let classes = ['is-success', 'is-warning', 'is-danger'];
          document.getElementById(id).classList.remove(...classes);
          document.getElementById(id).classList.add(classes[this.difficulty - 1]);
          return this.languages[this.lang]['difficulty' + this.difficulty];
        case 'wordTag':
          return this.vocabWords.length;
        default:
          return this.languages[this.lang][id];
      }
    },
    navigateTo: function (id) {
      if (id === 'mainMenu') {
        selection.selectDifficulty(this.difficulty);
        selection.selectCount(this.wordCount);
        this.option = '';
        this.currentWord = 0;
      }
      this.page = id;
    },
    move: function (forward) {
      if (forward) {
        this.currentWord++;
      } else {
        this.currentWord--;
      }
    },
    getCurrentWord: function (property) {
      if (this.vocabWords.length === 0) {
        return "";
      } else if (this.currentWord === this.vocabWords.length) {
        if (property === 'german') {
          return this.languages[this.lang]['trainingFinished'];
        } else {
          return "";
        }
      } else {
        return this.vocabWords[this.currentWord][property];
      }
    }
  }
});