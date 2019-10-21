function CanvasDict(globalDict) {
  this.gD = globalDict;
  this.canvas = document.getElementById("adventureCanvas");
  this.context = this.canvas.getContext("2d");
  this.raf = null;
  this.startTS = 0;
  this.lag = 0;
  this.refreshrate = 1000 / 60;
  this.frameNo = 0;
  this.canvasLoop = function (timestamp) {
    if (this.page === 'adventure') {
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

      this.clearCanvas();
      this.canvasDraw();

      this.startTS = timestamp;
    }
  };
  this.canvasDraw = function () {
    this.backgrounds.map(background => {
      drawCanvasImage(background, this);
    }, this);

    drawCanvasImage(this.player, this);

    if (this.vocabWords.length !== 0) {
      drawCanvasRect(this.canvas.width / 2 - 150, 0, 300, 30, 'standardBlur', this);
      drawCanvasText(this.canvas.width / 2, 15, this.vocabWords[this.currentWord][this.lang], 'standard', this);
    }
  };
  this.clearCanvas = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };
}