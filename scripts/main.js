function main() {
  let globalDict = new GlobalDict();
  let viewport = document.querySelector("[name~=viewport][content]");
  if (window.screen.width * window.devicePixelRatio < 1150) {
    viewport.content = "width=device-width, initial-scale=0.75";
  }
  globalDict.loadData();
  globalDict.createKanji();
}

function GlobalDict() {
  this.languageSelection = 'Deutsch';
  this.lang = 'Deutsch';
  this.languages = languages;
  this.themeSelection = 'design1';
  this.theme = 'design1';
  this.themes = {
    "design1": {
      link: "css/bulmaswatch.darkly.min.css"
    },
    "design2": {
      link: "https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css"
    },
    "design3": {
      link: "css/bulmaswatch.slate.min.css"
    },
    "design4": {
      link: "css/bulmaswatch.solar.min.css"
    }
  };
  this.sizeSelection = 'normal';
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
    icon: {
      small: 'is-small',
      normal: '',
      medium: 'is-medium',
      large: 'is-large'
    },
    fas: {
      small: '',
      normal: '',
      medium: 'fa-lg',
      large: 'fa-2x'
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
    },
    tabs: {
      small: 'is-small',
      normal: '',
      medium: 'is-medium',
      large: 'is-large'
    },
    help: {
      small: 'is-small',
      normal: '',
      medium: 'is-medium',
      large: 'is-large'
    }
  };
  this.signs = signs;
  this.vocabs = vocabs;
  this.page = 'mainMenu';
  this.option = '';
  this.difficulty = '';
  this.showResults = false;
  this.resultIsVisible = false;
  this.actionIsVisible = false;
  this.romajiInput = '';
  this.romajiInputOriginal = '';
  this.kanaInput = '';
  this.kanaInputOriginal = '';
  this.showStatistics = false;
  this.keyboardHidden = true;
  this.activeTab = 'hiragana';
  this.showRUSURE = false;
  this.customSelected = false;
  this.countCustom = '';
  this.items = [
    {
      id: 'wood', spriteKey: 'img/sprites/Item/Wood.png', quantity: 1, points: 3, costs: [
        {id: 'statusRight', quantity: 5}
      ]
    },
    {
      id: 'stone', spriteKey: 'img/sprites/Item/Stone.png', quantity: 1, points: 3, costs: [
        {id: 'statusRight', quantity: 6}
      ]
    },
    {
      id: 'ironOre', spriteKey: 'img/sprites/Item/Ironore.png', quantity: 1, points: 9, costs: [
        {id: 'statusRight', quantity: 29}
      ]
    },
    {
      id: 'fish', spriteKey: 'img/sprites/Item/Fish.png', quantity: 1, points: 6, costs: [
        {id: 'statusRight', quantity: 15}
      ]
    },
    {
      id: 'worm', spriteKey: 'img/sprites/Item/Worm.png', quantity: 1, points: 1, costs: [
        {id: 'statusRight', quantity: 2}
      ]
    },
    {
      id: 'apple', spriteKey: 'img/sprites/Item/Apple.png', quantity: 1, points: 5, costs: [
        {id: 'statusRight', quantity: 5}
      ]
    },
    {
      id: 'string', spriteKey: 'img/sprites/Item/String.png', quantity: 1, points: 7, costs: [
        {id: 'cobwebs', quantity: 12},
        {id: 'statusRight', quantity: 8}
      ]
    },
    {
      id: 'shovel', spriteKey: 'img/sprites/Item/Shovel.png', quantity: 1, points: 11, costs: [
        {id: 'wood', quantity: 4},
        {id: 'stone', quantity: 2},
        {id: 'string', quantity: 2},
        {id: 'statusRight', quantity: 50}
      ]
    },
    {
      id: 'axe', spriteKey: 'img/sprites/Item/Axe.png', quantity: 1, points: 13, costs: [
        {id: 'wood', quantity: 4},
        {id: 'stone', quantity: 2},
        {id: 'string', quantity: 2},
        {id: 'statusRight', quantity: 35}
      ]
    },
    {
      id: 'fishingRod', spriteKey: 'img/sprites/Item/Fishing_Rod.png', quantity: 16, points: 3, costs: [
        {id: 'wood', quantity: 3},
        {id: 'string', quantity: 5},
        {id: 'statusRight', quantity: 85}
      ]
    },
    {
      id: 'pickaxe', spriteKey: 'img/sprites/Item/Pickaxe.png', quantity: 1, points: 18, costs: [
        {id: 'wood', quantity: 3},
        {id: 'stone', quantity: 5},
        {id: 'string', quantity: 2},
        {id: 'statusRight', quantity: 120}
      ]
    },
    {
      id: 'cobwebs', spriteKey: 'img/sprites/Item/Cobwebs.png', quantity: 1
    }
  ];
  this.inventory = [
    {id: 'shovel', spriteKey: 'img/sprites/Item/Shovel.png', quantity: 55},
    {id: 'wood', spriteKey: 'img/sprites/Item/Wood.png', quantity: 50}
  ];
  this.searchResult = [];
  this.searchTerm = '';
  this.searchSelected = false;
  this.wordCount = 0;
  this.vocabWords = [];
  this.currentWord = 0;
  this.currentShopPage = 1;
  this.scores = {
    scores: [
      {id: 'statusLeft', number: 0},
      {id: 'statusMiddle', number: 0},
      {id: 'statusRight', number: 0}
    ]
  };
  this.saveData = function () {
    window.localStorage.setItem('globalDict', JSON.stringify({
      "lang": this.lang,
      "theme": this.theme,
      "size": this.size,
      "scores": this.scores,
      "inventory": this.inventory
    }));
  };
  this.loadData = function () {
    let data = JSON.parse(window.localStorage.getItem('globalDict'));
    if (data) {
      if (data.lang) {
        this.lang = data.lang;
        this.languageSelection = data.lang;
      }
      if (data.theme) {
        this.theme = data.theme;
        this.themeSelection = data.theme;
      }
      if (data.size) {
        this.size = data.size;
        this.sizeSelection = data.size;
      }
      if (data.scores) {
        this.scores = data.scores;
      }
      if (data.inventory) {
        this.inventory = data.inventory;
      }
    }
  };
  this.resetData = function () {
    this.lang = 'Deutsch';
    this.theme = 'design1';
    this.size = 'normal';
    this.scores = {
      scores: [
        {id: 'statusLeft', number: 0},
        {id: 'statusMiddle', number: 0},
        {id: 'statusRight', number: 0}
      ]
    };
    this.inventory = [];
  };
  this.createKanji = function () {
    let set = new Set(this.vocabs.flatMap(entry => entry.kana.split('')));
    for (let [, value] of this.signs.entries()) {
      value.map(sign => {
        set.delete(sign[1]);
      }, this);
    }
    let kanji = [];
    for (let value of set.values()) {
      kanji.push(['', value]);
    }
    this.signs.set('kanji', kanji);
  };
  this.canvasDict = null;
  this.vueDict = new VueDict(this);
  this.canvasDict = new CanvasDict(this);
}