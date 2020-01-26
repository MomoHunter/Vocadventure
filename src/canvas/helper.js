import Styles from '@/canvas/styles.json'

/**
 * Draws a filled rectangle onto the used canvas
 * @param {number} x x-coordinate of the rectangle's top-left corner
 * @param {number} y y-coordinate of the rectangle's top-left corner
 * @param {number} width
 * @param {number} height
 * @param {string} styleKey defines the appearance of the rectangle
 * @param {CanvasRenderingContext2D} context
 */
export function drawCanvasRect (x, y, width, height, styleKey, context) {
  let style = Styles.rect[styleKey]
  context.fillStyle = `rgba(${style.backgroundColor})`
  context.fillRect(x, y, width, height)
}

/**
 * Draw text onto the used canvas.
 * Its positioning is affected by the attributes saved inside the used Style-Key.
 * @param {number} x x-coordinate for the positioning point
 * @param {number} y y-coordinate for the positioning point
 * @param {string} text text to be written
 * @param {string} styleKey defines the appearance of the text
 * @param {CanvasRenderingContext2D} context
 */
export function drawCanvasText (x, y, text, styleKey, context) {
  let style = Styles.text[styleKey]
  context.textAlign = style.align
  context.textBaseline = style.baseline
  context.font = style.font
  context.fillStyle = `rgba(${style.color})`
  context.fillText(text, x, y)
  if (style.borderKey !== '') {
    drawCanvasTextBorder(x, y, text, style.borderKey, context)
  }
}

/**
 * Draw a border for text onto the used canvas.
 * Its positioning is affected by the attributes saved inside the used Style-Key.
 * @param {number} x x-coordinate for the positioning point
 * @param {number} y y-coordinate for the positioning point
 * @param {string} text text for witch the outline should be drawn
 * @param {string} styleKey defines the appearance of the text
 * @param {CanvasRenderingContext2D} context
 */
export function drawCanvasTextBorder (x, y, text, styleKey, context) {
  let style = Styles.border[styleKey]
  context.strokeStyle = `rgba(${style.borderColor})`
  context.lineWidth = style.borderSize
  context.setLineDash(style.lineDash)
  context.strokeText(text, x, y)
}
