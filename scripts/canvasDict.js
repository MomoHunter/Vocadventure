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
  this.animationStart = 0;
  this.backgroundAnimationSpeed = 1;
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
    "Background_Tiles_Bridge_B": [true, 505, [1505, 1806, 2107, 2408], 480, 300],
    "Background_Tiles_Bridge_F": [false, 505, 2709, 480, 300],
    "Background_Tiles_Dirtmine": [false, 505, 3010, 96, 300],
    "Background_Tiles_Sky": [false, 505, 3311, 600, 180],
    "Background_Tiles_Stone": [false, 505, 3492, 288, 300],
    "Decoration_Bush1": [false, 1106, 0, 96, 36],
    "Decoration_Bush2": [false, 1106, 37, 108, 48],
    "Decoration_Bush3": [false, 1106, 86, 120, 48],
    "Decoration_Bush4": [false, 1106, 135, 120, 48],
    "Decoration_Farn1": [false, 1106, 184, 24, 36],
    "Decoration_Farn10": [false, 1106, 221, 24, 36],
    "Decoration_Farn2": [false, 1106, 258, 24, 48],
    "Decoration_Farn3": [false, 1106, 307, 24, 60],
    "Decoration_Farn4": [false, 1106, 368, 36, 72],
    "Decoration_Farn5": [false, 1106, 441, 12, 36],
    "Decoration_Farn6": [false, 1106, 478, 12, 48],
    "Decoration_Farn7": [false, 1106, 527, 36, 72],
    "Decoration_Farn8": [false, 1106, 600, 24, 60],
    "Decoration_Farn9": [false, 1106, 661, 24, 48],
    "Decoration_Flower1": [false, 1106, 710, 36, 48],
    "Decoration_Flower2": [false, 1106, 759, 36, 48],
    "Decoration_Flower3": [false, 1106, 808, 36, 48],
    "Decoration_Flower4": [false, 1106, 857, 36, 48],
    "Decoration_Flower5": [false, 1106, 906, 36, 48],
    "Decoration_Flower6": [false, 1106, 955, 36, 48],
    "Item_Apple": [false, 1227, 0, 84, 96],
    "Item_Axe": [false, 1227, 97, 108, 84],
    "Item_Cobwebs": [false, 1227, 182, 96, 96],
    "Item_Fish": [false, 1227, 279, 96, 72],
    "Item_Fishing_Rod": [false, 1227, 352, 96, 96],
    "Item_Ironore": [false, 1227, 449, 96, 96],
    "Item_Pickaxe": [false, 1227, 546, 96, 96],
    "Item_Shovel": [false, 1227, 643, 96, 96],
    "Item_Stone": [false, 1227, 740, 96, 96],
    "Item_String": [false, 1227, 837, 96, 96],
    "Item_Wood": [false, 1227, 934, 96, 84],
    "Item_Worm": [false, 1227, 1019, 72, 96],
    "Player_Player": [false, 1336, 0, 72, 84],
    "Player_Player_Back": [false, 1336, 85, 72, 84],
    "Player_Player_Shadow": [false, 1336, 170, 36, 12],
    "Player_Player_Walk": [true, 1336, [183, 268], 72, 84],
    "Special_Placeholder": [false, 1409, 0, 40, 40],
    "Special_Placeholder_B": [false, 1409, 41, 80, 80]
  };
  // end spriteDict
  this.availableBackgrounds = [
    { spriteKey: 'Background_Tiles_Appletree', animationSpeed: 24, chance: 0.1 },
    { spriteKey: 'Background_Tiles_Basic', chance: 1 },
    { spriteKey: 'Background_Tiles_Bridge_B', animationSpeed: 12, chance: 10.1 },
    { spriteKey: 'Background_Tiles_Dirtmine', chance: 0.25 },
    { spriteKey: 'Background_Tiles_Stone', chance: 0.25 }
  ];
  this.player = {
    x: 198, y: 156, spriteKeys: ['Player_Player', 'Player_Player_Walk'], animationSpeed : 16
  };
  this.backgrounds = [
    {x: 0, y: 0, spriteKey: 'Background_Tiles_Basic'},
    {x: 288, y: 0, spriteKey: 'Background_Tiles_Bridge_B', animationSpeed: 12}
  ];
  this.canvasLoop = function (timestamp) {
    if (this.gD.page === 'adventure') {
      this.raf = requestAnimationFrame(timestamp => this.canvasLoop(timestamp));

      this.lag += timestamp - this.startTS;

      while (this.lag > this.refreshrate) {
        this.frameNo++;

        this.canvasUpdate();

        if (this.lag > this.refreshrate * 5) {
          this.lag %= this.refreshrate;
        } else {
          this.lag -= this.refreshrate;
        }
      }

      this.clearCanvas();
      this.canvasDraw();

      this.startTS = timestamp;
    }
  };
  this.canvasUpdate = function () {
    if (!this.animationInProgress && this.animationQueue.length > 0) {
      this.currentAnimation = this.animationQueue.pop();
      this.animationInProgress = true;
      this.animationStart = this.frameNo;
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
      this.backgrounds.map(background => {
        background.x = Math.round(background.x / 96) * 96;
      }, this);
      this.player.y = Math.round(this.player.y / 12) * 12;
      this.currentAnimation = null;
      this.animationInProgress = false;
      this.animationStart = 0;
    }
  };
  this.moveBackground = function () {
    for (let i = 0; i < this.backgrounds.length; i++) {
      this.backgrounds[i].x -= this.backgroundAnimationSpeed;

      if (this.backgrounds[i].spriteKey === 'Background_Tiles_Bridge_B') {
        if (this.backgrounds[i].x < 156 && this.backgrounds[i].x >= 96) {
          this.player.y -= 24 / 60 * this.backgroundAnimationSpeed;
        } else if (this.backgrounds[i].x < 96 && this.backgrounds[i].x >= 0) {
          this.player.y -= 12 / 96 * this.backgroundAnimationSpeed;
        } else if (this.backgrounds[i].x < 0 && this.backgrounds[i].x >= -96) {
          this.player.y += 12 / 96 * this.backgroundAnimationSpeed;
        } else if (this.backgrounds[i].x < -96 && this.backgrounds[i].x >= -132) {
          this.player.y += 24 / 36 * this.backgroundAnimationSpeed;
        }
      }

      let {spriteWidth} = getSpriteData(this.backgrounds[i].spriteKey, this);
      if (i === 0) {
        if (this.backgrounds[i].x + spriteWidth < -100) {
          this.backgrounds.splice(i, 1);
          i--;
        }
      }
      if (i === this.backgrounds.length - 1) {
        if (this.backgrounds[i].x + spriteWidth < this.canvas.width + 100) {
          let total = 0;
          let random;
          this.availableBackgrounds.map(availableBackground => {
            total += availableBackground.chance;
          }, this);

          random = Math.random() * total;

          for (let j = 0; j < this.availableBackgrounds.length; j++) {
            random -= this.availableBackgrounds[j].chance;
            if (random <= 0) {
              let newBackground = {
                x: this.backgrounds[i].x + spriteWidth,
                y: 0,
                spriteKey: this.availableBackgrounds[j].spriteKey
              };
              if (this.availableBackgrounds[j].animationSpeed) {
                newBackground.animationSpeed = this.availableBackgrounds[j].animationSpeed
              }
              this.backgrounds.push(newBackground);
              break;
            }
          }
        }
      }
    }

    this.currentAnimation.counter += 1;

    return this.currentAnimation.counter >= this.currentAnimation.goal;
  };
  this.canvasDraw = function () {
    let bridgeDraws = [];
    drawCanvasImage(0, 0, 'Background_Tiles_Sky', this);

    this.backgrounds.map((background, index) => {
      drawCanvasImage(
        background.x, background.y, background.spriteKey, this,
        background.animationSpeed ? background.animationSpeed : undefined
      );
      if (background.spriteKey === 'Background_Tiles_Bridge_B') {
        bridgeDraws.push(index);
      }
    }, this);

    let playerKey = 0;
    if (this.currentAnimation) {
      if (this.currentAnimation.type === 'moveBackground') {
        playerKey = 1;
      }
    }

    drawCanvasImage(
      this.player.x, this.player.y, this.player.spriteKeys[playerKey], this, this.player.animationSpeed, true
    );
    if (playerKey === 1) {
      drawCanvasImage(this.player.x, this.player.y + 72, 'Player_Player_Shadow', this);
    }

    bridgeDraws.map(index => {
      let background = this.backgrounds[index];
      drawCanvasImage(
        background.x, background.y, 'Background_Tiles_Bridge_F', this,
        background.animationSpeed ? background.animationSpeed : undefined
      );
    }, this);

    if (this.gD.vocabWords.length !== 0) {
      drawCanvasRect(this.canvas.width / 2 - 150, 0, 300, 30, 'standardBlur', this);
      drawCanvasText(this.canvas.width / 2, 15, this.gD.vocabWords[this.gD.currentWord][this.gD.lang], 'standard', this);
    }
  };
  this.clearCanvas = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}
