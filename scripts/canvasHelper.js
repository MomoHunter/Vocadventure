/**
 * Draw text onto the used canvas.
 * Its positioning is affected by the attributes saved inside the used Style-Key.
 * @param {number} x x-coordinate for the positioning point
 * @param {number} y y-coordinate for the positioning point
 * @param {string} text text to be written
 * @param {string} styleKey defines the appearance of the text
 * @param {GlobalDict} gD
 */
function drawCanvasText(x, y, text, styleKey, gD) {
  let style = gD.styles.text[styleKey];
  gD.context.textAlign = style.align;
  gD.context.textBaseline = style.baseline;
  gD.context.font = style.font;
  gD.context.fillStyle = `rgba(${style.color})`;
  gD.context.fillText(text, x, y);
  if (style.borderKey !== "") {
    drawCanvasTextBorder(x, y, text, style.borderKey, gD);
  }
}

/**
 * Draw a border for text onto the used canvas.
 * Its positioning is affected by the attributes saved inside the used Style-Key.
 * @param {number} x x-coordinate for the positioning point
 * @param {number} y y-coordinate for the positioning point
 * @param {string} text text for witch the outline should be drawn
 * @param {string} styleKey defines the appearance of the text
 * @param {GlobalDict} gD
 */
function drawCanvasTextBorder(x, y, text, styleKey, gD) {
  let style = gD.styles.border[styleKey];
  gD.context.strokeStyle = `rgba(${style.borderColor})`;
  gD.context.lineWidth = style.borderSize;
  gD.context.setLineDash(style.lineDash);
  gD.context.strokeText(text, x, y);
}

/**
 * Draws a filled rectangle onto the used canvas.
 * @param {number} x x-coordinate of the rectangle's top-left corner
 * @param {number} y y-coordinate of the rectangle's top-left corner
 * @param {number} width
 * @param {number} height
 * @param {string} styleKey defines the appearance of the rectangle
 * @param {GlobalDict} gD
 */
function drawCanvasRect(x, y, width, height, styleKey, gD) {
  let style = gD.styles.rect[styleKey];
  gD.context.fillStyle = `rgba(${style.backgroundColor})`;
  gD.context.fillRect(x, y, width, height);
}