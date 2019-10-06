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
  this.size = 'normal';
  this.classes = {
    button: {
      small: 'is-small',
      normal: '',
      medium: 'is-medium',
      large: 'is-large'
    },
    select: {
      small: 'is-small',
      normal: '',
      medium: 'is-medium',
      large: 'is-large'
    },
    input: {
      small: 'is-small',
      normal: '',
      medium: 'is-medium',
      large: 'is-large'
    },
    title: {
      small: 'is-5',
      normal: 'is-4',
      medium: 'is-3',
      large: 'is-2'
    },
    subtitle: {
      small: 'is-6',
      normal: 'is-6',
      medium: 'is-5',
      large: 'is-4'
    },
    tag: {
      small: 'is-normal',
      normal: 'is-normal',
      medium: 'is-medium',
      large: 'is-medium'
    },
    content: {
      small: 'is-small',
      normal: '',
      medium: 'is-medium',
      large: 'is-large'
    },
    label: {
      small: 'is-small',
      normal: '',
      medium: 'is-medium',
      large: 'is-large'
    },
    progress: {
      small: 'is-small',
      normal: '',
      medium: 'is-medium',
      large: 'is-large'
    }
  };
  this.vocabs = vocabs;
  this.page = 'mainMenu';
  this.option = '';
  this.difficulty = '';
  this.customSelected = false;
  this.items = [
    { id: 'shovel', spriteKey: 'img/sprites/Schaufel.png', costs: [
        { id: 'wood', quantity: 4 }
      ]},
    { id: 'shovel2', spriteKey: 'img/sprites/Axt.png', costs: [
        { id: 'wood', quantity: 4 }
      ]},
    { id: 'shovel3', spriteKey: '', costs: [
        { id: 'wood', quantity: 4 }
      ]},
    { id: 'shovel4', spriteKey: '', costs: [
        { id: 'wood', quantity: 4 }
      ]},
    { id: 'shovel3', spriteKey: '', costs: [
        { id: 'wood', quantity: 4 }
      ]},
    { id: 'shovel4', spriteKey: '', costs: [
        { id: 'wood', quantity: 4 }
      ]},
    { id: 'shovel', spriteKey: 'img/sprites/Schaufel.png', costs: [
        { id: 'wood', quantity: 4 }
      ]},
    { id: 'shovel2', spriteKey: 'img/sprites/Axt.png', costs: [
        { id: 'wood', quantity: 4 }
      ]}
  ];
  this.inventory = [];
  this.searchSelected = false;
  this.wordCount = 0;
  this.vocabWords = [];
  this.currentWord = 0;
  this.currentItem = 0;
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
      "size": this.size,
      "scores": this.scores
    }));
  };
  this.loadData = function() {
    let data = JSON.parse(window.localStorage.getItem('globalDict'));
    if (data) {
      this.lang = data.lang;
      this.design = data.design;
      this.size = data.size;
      this.scores = data.scores;
      document.getElementById('bulmaCSS').href = this.designs[this.design].link;
    }
  }
}

const gD = new GlobalDict();
gD.loadData();

document.getElementById("test").innerText = window.screen.width + " " + window.screen.height +
  " " + window.screen.availWidth + " " + window.screen.availHeight;

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
    },
    getClass: function(type) {
      return this.classes[type][this.size];
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
    getClass: function(type) {
      return this.classes[type][this.size];
    },
    navigateTo: function (id) {
      this.page = id;
    },
    applySettings: function () {
      this.lang = document.getElementById('languageSelection').value;
      this.design = document.getElementById('themeSelection').value;
      document.getElementById('bulmaCSS').href = this.designs[this.design].link;
      this.size = document.getElementById('sizeSelection').value;
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
    },
    isCustomSelected: function () {
      return this.customSelected;
    }
  },
  methods: {
    getText: function (id) {
      if (id === 'custom' && !isNaN(parseInt(document.getElementById('countCustom').value)) ) {
        return parseInt(document.getElementById('countCustom').value);
      }
      return this.languages[this.lang][id];
    },
    getClass: function(type) {
      return this.classes[type][this.size];
    },
    showCustom: function (show) {
      this.customSelected = show;
      if (!show) {
        if ((!isNaN(parseInt(document.getElementById('countCustom').value)) && this.wordCount !== 'Custom') ||
            (isNaN(parseInt(document.getElementById('countCustom').value)) && this.wordCount === 'Custom')) {
          this.selectCount('Custom');
        }
      }
    },
    navigateTo: function (id) {
      if (id === 'mainMenu') {
        this.selectDifficulty(this.difficulty);
        this.selectCount(this.wordCount);
        document.getElementById('countCustom').value = '';
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
      } else if (number === 'Custom') {
        document.getElementById('countCustomButton').classList.remove('is-outlined');
      }
      if (this.wordCount !== 0) {
        if (this.wordCount === 'Custom') {
          document.getElementById('countCustomButton').classList.add('is-outlined');
        } else {
          document.getElementById('count' + this.wordCount).classList.add('is-outlined');
        }
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
        document.getElementById('countCustom').value = '';
        this.option = '';
      }
      this.currentWord = 0;
      this.page = id;
    },
    getClass: function(type, difficultyTag = false) {
      if (difficultyTag) {
        let classes = ['is-success', 'is-warning', 'is-danger'];
        return this.classes[type][this.size] + " " + classes[this.difficulty - 1];
      } else {
        return this.classes[type][this.size];
      }
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
        if (property === this.lang) {
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

var shop = new Vue({
  el: '#shop',
  data: gD,
  computed: {
    isSeen: function () {
      return this.page === 'shop';
    },
    isShop: function () {
      return this.option === 'shop';
    },
    searchActivated: function () {
      return this.searchSelected;
    },
    getPage: function () {
      if (this.option === 'shop') {
        return ((this.currentItem + 4) / 4) + " / " + Math.ceil(this.items.length / 4);
      } else {
        return ((this.currentItem + 4) / 4) + " / " + Math.ceil(this.inventory.length / 4);
      }
    }
  },
  methods: {
    getText: function (id) {
      return this.languages[this.lang][id];
    },
    navigateTo: function (id, option = '') {
      document.getElementById('searchField').value = '';
      if ((this.option === 'shop' && option === 'inventory') ||
          (this.option === 'inventory' && option === 'shop') ||
          option === '') {
        this.currentItem = 0;
      }
      this.page = id;
      this.option = option;
    },
    getClass: function(type) {
      return this.classes[type][this.size];
    },
    getItemname: function (position) {
      if (this.option === 'shop') {
        if (this.currentItem + position < this.items.length) {
          return this.languages[this.lang][this.items[this.currentItem + position].id];
        } else {
          return "";
        }
      } else {
        if (this.currentItem + position < this.inventory.length) {
          return this.languages[this.lang][this.inventory[this.currentItem + position].id];
        } else {
          return "";
        }
      }
    },
    getItemimage: function (position) {
      if (this.option === 'shop') {
        if (this.currentItem + position < this.items.length) {
          return { "background-image": "url(" + this.items[this.currentItem + position].spriteKey + ")" };
        } else {
          return "";
        }
      } else {
        if (this.currentItem + position < this.inventory.length) {
          return this.inventory[this.currentItem + position].spriteKey;
        } else {
          return "";
        }
      }
    },
    nextPage: function (pages) {
      if (this.option === 'shop') {
        if (this.currentItem + pages * 4 < this.items.length && this.currentItem + pages >= 0) {
          this.currentItem += pages * 4;
        }
      } else {
        if (this.currentItem + pages * 4 < this.inventory.length && this.currentItem + pages >= 0) {
          this.currentItem += pages * 4;
        }
      }
    },
    showBox: function (position) {
      if (this.option === 'shop') {
        return this.currentItem + position < this.items.length;
      } else {
        return this.currentItem + position < this.inventory.length;
      }
    },
    showSearch: function (show) {
      this.searchSelected = show;
    }
  }
});

var details = new Vue({
  el: '#details',
  data: gD,
  computed: {
    isSeen: function () {
      return this.page === 'details';
    }
  },
  methods: {
    getText: function (id) {
      if (id === 'titleDetails' && !isNaN(this.currentItem + this.option)) {
        return this.languages[this.lang][this.items[this.currentItem + this.option].id];
      } else {
        return this.languages[this.lang][id];
      }
    },
    navigateTo: function (id, option = '') {
      this.page = id;
      this.option = option;
    },
    getClass: function(type) {
      return this.classes[type][this.size];
    }
  }
});