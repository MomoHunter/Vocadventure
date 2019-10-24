function CanvasDict(globalDict) {
  this.gD = globalDict;
  this.canvas = document.getElementById("adventureCanvas");
  this.context = this.canvas.getContext("2d");
  this.spritesheet = new Image();
  this.spritesheet.src = "img/Spritesheet.png";
  this.raf = null;
  this.startTS = 0;
  this.lag = 0;
  this.refreshrate = 1000 / 60;
  this.frameNo = 0;
  this.animationInProgress = false;
  this.animationQueue = [];
  this.currentAnimation = null;
  this.styles = styles;
  // start spriteDict
  // The following code is auto-generated, don't change it!
  /**
   * Maps a Sprite-Key to Location Information regarding the Sprite-Sheet as a key-value-dict.
   * @type {Object.<string, [boolean, number, number|Array<number>, number, number]>}
   * Each value's array has the contents: isAnimated, x-pos, y-pos, width, height.
   * If isAnimated is true, y-pos is an array, otherwise just a single number.
   */
  this.spriteDict = {
    "Background_Fuji": [false, 0, 0, 504, 120],
    "Background_Tiles_Appletree": [true, 505, [0, 301, 602, 903], 480, 300],
    "Background_Tiles_Basic": [false, 505, 1204, 288, 300],
    "Background_Tiles_Bridge": [true, 505, [1505, 1806, 2107, 2408], 480, 300],
    "Background_Tiles_Dirtmine": [false, 505, 2709, 96, 300],
    "Background_Tiles_Stone": [false, 505, 3010, 288, 300],
    "Decoration_Bush1": [false, 986, 0, 96, 36],
    "Decoration_Bush2": [false, 986, 37, 108, 48],
    "Decoration_Bush3": [false, 986, 86, 120, 48],
    "Decoration_Bush4": [false, 986, 135, 120, 48],
    "Decoration_Farn1": [false, 986, 184, 24, 36],
    "Decoration_Farn10": [false, 986, 221, 24, 36],
    "Decoration_Farn2": [false, 986, 258, 24, 48],
    "Decoration_Farn3": [false, 986, 307, 24, 60],
    "Decoration_Farn4": [false, 986, 368, 36, 72],
    "Decoration_Farn5": [false, 986, 441, 12, 36],
    "Decoration_Farn6": [false, 986, 478, 12, 48],
    "Decoration_Farn7": [false, 986, 527, 36, 72],
    "Decoration_Farn8": [false, 986, 600, 24, 60],
    "Decoration_Farn9": [false, 986, 661, 24, 48],
    "Decoration_Flower1": [false, 986, 710, 36, 48],
    "Decoration_Flower2": [false, 986, 759, 36, 48],
    "Decoration_Flower3": [false, 986, 808, 36, 48],
    "Decoration_Flower4": [false, 986, 857, 36, 48],
    "Decoration_Flower5": [false, 986, 906, 36, 48],
    "Decoration_Flower6": [false, 986, 955, 36, 48],
    "Item_Apple": [false, 1107, 0, 84, 96],
    "Item_Axe": [false, 1107, 97, 108, 84],
    "Item_Fish": [false, 1107, 182, 96, 72],
    "Item_Fishing_Rod": [false, 1107, 255, 96, 96],
    "Item_Ironore": [false, 1107, 352, 96, 96],
    "Item_Pickaxe": [false, 1107, 449, 96, 96],
    "Item_Shovel": [false, 1107, 546, 96, 96],
    "Item_Stone": [false, 1107, 643, 96, 96],
    "Item_Web": [false, 1107, 740, 96, 96],
    "Item_Wood": [false, 1107, 837, 96, 84],
    "Item_Worm": [false, 1107, 922, 72, 96],
    "Player_Player": [false, 1216, 0, 72, 84],
    "Player_Player_Back": [false, 1216, 85, 72, 84],
    "Player_Player_Walk": [true, 1216, [170, 255], 72, 84]
  };
  // end spriteDict
  this.availableBackgrounds = [
    { spriteKey: 'Background_Tiles_Appletree', animationSpeed: 24, chance: 0.1 },
    { spriteKey: 'Background_Tiles_Basic', chance: 1 },
    { spriteKey: 'Background_Tiles_Bridge', animationSpeed: 12, chance: 0.1 },
    { spriteKey: 'Background_Tiles_Dirtmine', chance: 0.25 },
    { spriteKey: 'Background_Tiles_Stone', chance: 0.25 }
  ];
  this.player = {
    x: 102, y: 156, spriteKey: 'Player_Player'
  };
  this.backgrounds = [
    {x: 0, y: 0, spriteKey: 'Background_Tiles_Basic'},
    {x: 288, y: 0, spriteKey: 'Background_Tiles_Appletree', animationSpeed: 24}
  ];
  this.canvasLoop = function (timestamp) {
    if (this.gD.page === 'adventure') {
      this.raf = requestAnimationFrame(timestamp => this.canvasLoop(timestamp));

      this.lag += timestamp - this.startTS;

      while (this.lag > this.refreshrate) {
        this.frameNo++;

        if (this.lag > this.refreshrate * 5) {
          this.lag %= this.refreshrate;
        } else {
          this.lag -= this.refreshrate;
        }
      }

      this.canvasUpdate();

      this.clearCanvas();
      this.canvasDraw();

      this.startTS = timestamp;
    }
  };
  this.canvasUpdate = function () {
    if (!this.animationInProgress && this.animationQueue.length > 0) {
      this.currentAnimation = this.animationQueue.pop();
      this.animationInProgress = true;
    }
    if (this.currentAnimation) {
      this.animate();
    }
  };
  this.animate = function () {
    let animationFinished = false;
    switch (this.currentAnimation.type) {
      case 'moveBackground':
        animationFinished = this.moveBackground();
        break;
      default:
    }
    if (animationFinished) {
      this.currentAnimation = null;
      this.animationInProgress = false;
    }
  };
  this.moveBackground = function () {
    this.backgrounds.map((background, index) => {
      background.x -= 1;

      let {spriteWidth} = getSpriteData(background.spriteKey, this);
      if (index === 0) {
        if (background.x + spriteWidth < -100) {
          this.backgrounds.splice(index, 1);
        }
      }
      if (index === this.backgrounds.length - 1) {
        if (background.x + spriteWidth < this.canvas.width + 100) {
          let total = 0;
          let random = 0;
          this.availableBackgrounds.map(availableBackground => {
            total += availableBackground.chance;
          }, this);

          random = Math.random() * total;

          for (let i = 0; i < this.availableBackgrounds.length; i++) {
            random -= this.availableBackgrounds[i].chance;
            if (random <= 0) {
              let newBackground = {
                x: background.x + spriteWidth,
                y: 0,
                spriteKey: this.availableBackgrounds[i].spriteKey
              };
              if (this.availableBackgrounds[i].animationSpeed) {
                newBackground.animationSpeed = this.availableBackgrounds[i].animationSpeed
              }
              this.backgrounds.push(newBackground);
              break;
            }
          }
        }
      }
    }, this);

    this.currentAnimation.counter += 1;

    console.log(this.currentAnimation.counter, this.currentAnimation.goal);
    return this.currentAnimation.counter >= this.currentAnimation.goal;

  };
  this.canvasDraw = function () {
    this.backgrounds.map(background => {
      drawCanvasImage(
        background.x, background.y, background.spriteKey, this,
        background.animationSpeed ? background.animationSpeed : undefined
      );
    }, this);

    drawCanvasImage( this.player.x, this.player.y, this.player.spriteKey, this);

    if (this.gD.vocabWords.length !== 0) {
      drawCanvasRect(this.canvas.width / 2 - 150, 0, 300, 30, 'standardBlur', this);
      drawCanvasText(this.canvas.width / 2, 15, this.gD.vocabWords[this.gD.currentWord][this.gD.lang], 'standard', this);
    }
  };
  this.clearCanvas = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}
