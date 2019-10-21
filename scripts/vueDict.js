function VueDict(globalDict) {
  this.gD = globalDict;
  this.css = new Vue({
    el: '#bulmaCSS',
    data: globalDict,
    computed: {
      getDesign: function () {
        return this.themes[this.theme].link;
      }
    }
  });
  this.status = new Vue({
    el: '#status',
    data: globalDict,
    methods: {
      getText: function (id) {
        return this.languages[this.lang][id];
      }
    }
  });
  this.mainMenu = new Vue({
    el: '#mainMenu',
    data: globalDict,
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
  this.selection = new Vue({
    el: '#selection',
    data: globalDict,
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
        if (id === 'custom' && !isNaN(+this.countCustom) && +this.countCustom !== 0 ) {
          return +this.countCustom;
        }
        return this.languages[this.lang][id];
      },
      getClass: function(type) {
        return this.classes[type][this.size];
      },
      getDifficultyClass: function (difficulty) {
        if (this.difficulty === difficulty) {
          return '' + this.classes['button'][this.size];
        } else {
          return 'is-outlined ' + this.classes['button'][this.size];
        }
      },
      getCountClass: function (count) {
        if (this.wordCount === count) {
          return '' + this.classes['button'][this.size];
        } else {
          return 'is-outlined ' + this.classes['button'][this.size];
        }
      },
      showCustom: function (show) {
        this.customSelected = show;
        if (!show) {
          if ((!isNaN(+this.countCustom) && this.wordCount !== 'Custom') ||
            (isNaN(+this.countCustom) && this.wordCount === 'Custom')) {
            this.selectCount('Custom');
          }
        }
      },
      navigateTo: function (id) {
        if (id === 'mainMenu') {
          this.selectDifficulty(this.difficulty);
          this.selectCount(this.wordCount);
          this.countCustom = '';
          this.option = '';
          this.currentWord = 0;
        }
        this.page = id;
      },
      selectDifficulty: function (number) {
        if (this.difficulty === number) {
          this.difficulty = '';
        } else {
          this.difficulty = number;
        }
      },
      selectCount: function (number) {
        if (this.wordCount === number) {
          this.wordCount = 0;
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
          let maxWords = this.wordCount === 'Custom' ? +this.countCustom : this.wordCount;
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
        if (this.page === 'adventure') {
          console.log(this);
          this.canvasDict.raf = requestAnimationFrame(timestamp => this.canvasDict.canvasLoop(timestamp));
        }
      }
    }
  });
  this.training = new Vue({
    el: '#training',
    data: globalDict,
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
          this.selection.selectDifficulty(this.difficulty);
          this.selection.selectCount(this.wordCount);
          this.countCustom = '';
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
  this.adventure = new Vue({
    el: '#adventure',
    data: globalDict,
    computed: {
      isSeen: function () {
        return this.page === 'adventure';
      },
      romajiIsCorrect: function () {
        if (this.vocabWords.length !== 0) {
          if (this.romajiInputOriginal.toLowerCase() === this.vocabWords[this.currentWord].romaji.toLowerCase()) {
            return true;
          }
        }
        return false;
      },
      kanaIsCorrect: function () {
        if (this.vocabWords.length !== 0) {
          if (this.kanaInputOriginal === this.vocabWords[this.currentWord].kana) {
            return true;
          }
        }
        return false;
      },
      getRomaji: function () {
        if (this.vocabWords.length !== 0) {
          if (this.currentWord < this.vocabWords.length) {
            return this.vocabWords[this.currentWord].romaji;
          }
        }
        return '';
      },
      getKana: function () {
        if (this.vocabWords.length !== 0) {
          if (this.currentWord < this.vocabWords.length) {
            return this.vocabWords[this.currentWord].kana;
          }
        }
        return '';
      },
      finishedAdventure: function () {
        return this.currentWord === this.vocabWords.length - 1;
      },
      getProgress: function () {
        return this.currentWord / this.vocabWords.length;
      },
      getProgressText: function () {
        return this.currentWord + " / " + this.vocabWords.length;
      },
      keyboardClass: function () {
        if (this.keyboardHidden) {
          return '';
        } else {
          return 'has-addons';
        }
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
          this.selection.selectDifficulty(this.difficulty);
          this.selection.selectCount(this.wordCount);
          this.countCustom = '';
          this.option = '';
        }
        this.currentWord = 0;
        this.showResults = false;
        this.romajiInput = '';
        this.romajiInputOriginal = '';
        this.kanaInput = '';
        this.kanaInputOriginal = '';
        this.page = id;
      },
      getClass: function (type, difficultyTag = false) {
        if (difficultyTag) {
          let classes = ['is-success', 'is-warning', 'is-danger'];
          return this.classes[type][this.size] + " " + classes[this.difficulty - 1];
        } else {
          return this.classes[type][this.size];
        }
      },
      getInputClass: function (inputName) {
        if (inputName === 'romaji') {
          if (!this.showResults) {
            return this.classes['input'][this.size];
          } else if (this.romajiIsCorrect) {
            return 'is-success ' + this.classes['input'][this.size];
          } else {
            return 'is-danger ' + this.classes['input'][this.size];
          }
        } else {
          if (!this.showResults) {
            return this.classes['input'][this.size];
          } else if (this.kanaIsCorrect) {
            return 'is-success ' + this.classes['input'][this.size];
          } else {
            return 'is-danger ' + this.classes['input'][this.size];
          }
        }
      },
      showItems: function () {

      },
      hideSpecialKeyboard: function (isHidden) {
        if (!this.showResults) {
          this.keyboardHidden = isHidden;
        }
      },
      addKana: function (sign) {
        this.kanaInput += sign;
        let input = document.getElementById("kanaInput");
        input.scrollLeft = input.scrollWidth;
      },
      removeKana: function () {
        if (this.kanaInput.length !== 0) {
          this.kanaInput = this.kanaInput.substring(0, this.kanaInput.length - 1);
        }
      },
      showResult: function () {
        if (!this.resultIsVisible) {
          this.romajiInput = this.vocabWords[this.currentWord].romaji;
          this.kanaInput = this.vocabWords[this.currentWord].kana;
          this.resultIsVisible = true;
        } else {
          this.romajiInput = this.romajiInputOriginal;
          this.kanaInput = this.kanaInputOriginal;
          this.resultIsVisible = false;
        }
      },
      setActiveTab: function (id) {
        this.activeTab = id;
      },
      getActiveTab: function (id) {
        if (id === this.activeTab) {
          return 'is-active';
        } else {
          return '';
        }
      },
      showTab: function (id) {
        return this.activeTab === id;
      },
      confirmInput: function () {
        this.showResults = true;
        this.romajiInputOriginal = this.romajiInput;
        this.kanaInputOriginal = this.kanaInput;
        let status = this.scores.scores.find(item => item.id === 'statusRight');
        if (this.romajiIsCorrect) {
          status.number += 1;
        }
        if (this.kanaIsCorrect) {
          switch (this.vocabWords[this.currentWord].difficulty) {
            case '1':
              status.number += 1;
              break;
            case '2':
              status.number += 2;
              break;
            case '3':
              status.number += 3;
              break;
            default:
              status.number += 1;
          }
        }
      },
      nextWord: function () {
        this.currentWord++;
        this.showResults = false;
        this.resultIsVisible = false;
        this.romajiInput = '';
        this.romajiInputOriginal = '';
        this.kanaInput = '';
        this.kanaInputOriginal = '';
      },
      showStats: function () {
        this.showStatistics = true;
      }
    }
  });
  this.shop = new Vue({
    el: '#shop',
    data: globalDict,
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
      showEmpty: function () {
        return this.searchResult.length === 0;
      },
      showPagination: function () {
        if (this.searchResult.length > 4) {
          return {};
        } else {
          return { opacity: 0 };
        }
      },
      getPage: function () {
        if (this.searchActivated) {
          return this.currentShopPage + " / " + Math.ceil(this.searchResult.length / 4);
        } else if (this.isShop) {
          return this.currentShopPage + " / " + Math.ceil(this.items.length / 4);
        } else {
          return this.currentShopPage + " / " + Math.ceil(this.inventory.length / 4);
        }
      },
      displayItems: function () {
        let displayedItems = [];
        this.searchResult = [];
        if (this.isShop) {
          if (this.searchTerm !== '') {
            this.items.map(item => {
              if (this.languages[this.lang][item.id].toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) {
                this.searchResult.push(item);
              }
            }, this);
          } else {
            this.items.map(item => {
              this.searchResult.push(item);
            }, this);
          }
        } else {
          if (this.searchTerm !== '') {
            this.inventory.map(item => {
              if (this.languages[this.lang][item.id].toLowerCase().indexOf(this.searchTerm.toLowerCase()) !== -1) {
                this.searchResult.push(item);
              }
            }, this);
          } else {
            this.inventory.map(item => {
              this.searchResult.push(item);
            }, this);
          }
        }

        for (let i = (this.currentShopPage - 1) * 4; i < Math.min(this.searchResult.length, this.currentShopPage * 4); i++) {
          displayedItems.push(this.searchResult[i]);
        }

        return displayedItems;
      }
    },
    methods: {
      getText: function (id) {
        return this.languages[this.lang][id];
      },
      navigateTo: function (id, option = '') {
        if (!(id === 'details' && !this.isShop)) {
          this.searchTerm = '';
          if ((this.isShop && option === 'inventory') ||
            (!this.isShop && option === 'shop') ||
            option === '') {
            this.currentShopPage = 1;
          }
          this.page = id;
          this.option = option;
        }
      },
      getClass: function(type) {
        return this.classes[type][this.size];
      },
      nextPage: function (pages) {
        if (this.searchResult.length === 0 ||
          (this.currentShopPage === Math.ceil(this.searchResult.length / 4) && pages === 1)) {
          this.currentShopPage = 1;
        } else if (this.currentShopPage === 1 && pages === -1) {
          this.currentShopPage = Math.ceil(this.searchResult.length / 4);
        } else {
          this.currentShopPage += pages;
        }
      },
      useSearch: function (show) {
        this.searchSelected = show;
        this.currentShopPage = 1;
        if (!show) {
          this.searchTerm = '';
        }
      }
    }
  });
  this.details = new Vue({
    el: '#details',
    data: globalDict,
    computed: {
      isSeen: function () {
        return this.page === 'details';
      },
      getUrl: function () {
        if (this.isSeen) {
          return this.items[(this.currentShopPage - 1) * 4 + this.option].spriteKey;
        } else {
          return "";
        }
      },
      getCosts: function () {
        if (this.isSeen) {
          return this.items[(this.currentShopPage - 1) * 4 + this.option].costs;
        } else {
          return [];
        }
      }
    },
    methods: {
      getText: function (id) {
        if (id === 'titleDetails' && this.isSeen) {
          return this.languages[this.lang][this.items[(this.currentShopPage - 1) * 4 + this.option].id];
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
      },
      getSpecialClass: function (own, needed) {
        if (own >= needed) {
          return 'is-success';
        } else {
          return 'is-danger';
        }
      },
      getOwn: function (id) {
        let quantity = 0;
        this.inventory.map(item => {
          if (item.id === id) {
            quantity = item.quantity;
          }
        }, this);
        this.scores.scores.map(status =>{
          if (status.id === id) {
            quantity = status.number;
          }
        }, this);
        return quantity;
      },
      buyItem: function () {
        let currentItem = this.items[(this.currentShopPage - 1) * 4 + this.option];
        let costs = currentItem.costs;
        let canBuy = true;
        costs.map(material => {
          let foundItem = this.inventory.find(item => item.id === material.id);
          let foundStatus = this.scores.scores.find(status => status.id === material.id);
          if (foundItem !== undefined) {
            if (material.quantity > foundItem.quantity) {
              canBuy = false;
            }
          } else if (foundStatus !== undefined) {
            if (material.quantity > foundStatus.number) {
              canBuy = false;
            }
          } else {
            canBuy = false;
          }
        }, this);

        if (canBuy) {
          let inventoryItem = this.inventory.find(item => item.id === currentItem.id);
          costs.map(material => {
            let foundItem = this.inventory.find(item => item.id === material.id);
            let foundStatus = this.scores.scores.find(status => status.id === material.id);
            if (foundItem !== undefined) {
              foundItem.quantity -= material.quantity;
            } else if (foundStatus !== undefined) {
              foundStatus.number -= material.quantity;
            }
          }, this);

          if (inventoryItem !== undefined) {
            inventoryItem.quantity += currentItem.quantity;
          } else {
            this.inventory.push({ id: currentItem.id, quantity: 1, spriteKey: currentItem.spriteKey });
          }
          this.saveData();
        }
      }
    }
  });
  this.settings = new Vue({
    el: '#settings',
    data: globalDict,
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
        this.lang = this.languageSelection;
        this.theme = this.themeSelection;
        this.size = this.sizeSelection;
        this.saveData();
      },
      showModal: function () {
        this.showRUSURE = true;
      }
    }
  });
  this.modal = new Vue({
    el: '#modal',
    data: globalDict,
    methods: {
      getClass: function(type) {
        return this.classes[type][this.size];
      },
      clearData: function () {
        window.localStorage.removeItem("globalDict");
        this.resetData();
        this.showRUSURE = false;
        this.page = 'mainMenu';
      },
      getText: function (id) {
        return this.languages[this.lang][id];
      },
      showModal: function () {
        this.showRUSURE = false;
      }
    }
  });
}