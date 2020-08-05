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

/**
 * Retrieves sprite information, falling back to the placeholder image if needed.
 * @param {string} spriteKey
 * @param {CanvasDict} cD
 * @return {{spriteWidth: number, spriteHeight: number, full: Array, key: string}}
 */
export function getSpriteData (spriteKey, cD) {
  let spriteData = cD.spriteDict[spriteKey]
  if (!spriteData) {
    console.error('Wrong key: ', spriteKey)
    spriteData = cD.spriteDict['special_placeholder']
  }
  return { spriteWidth: spriteData[3], spriteHeight: spriteData[4], full: spriteData, key: spriteKey }
}

/**
 * Draw a Sprite-Image onto the used canvas.
 * Its size is determined by the defined data of the given Sprite.
 * @param {number} x x-coordinate of the top-left corner
 * @param {number} y y-coordinate of the top-left corner
 * @param {string} spriteKey defines which sprite should be drawn
 * @param {CanvasDict} cD
 * @param {number} animationSpeed the speed of the animation, default: 12
 * @param {boolean} useCustomStart if animation should count from cD.animationStartFrame
 * @param {number} rotation  gives the rotation in degree
 */
export function drawCanvasImage (x, y, spriteKey, cD, animationSpeed = 12, useCustomStart = false, rotation = 0) {
  let { full: spriteData } = getSpriteData(spriteKey, cD)
  let [isAnim, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData

  if (isAnim && useCustomStart) {
    let frameNo = Math.floor((cD.frameNo - cD.animationStartFrame) / animationSpeed) % spriteY.length
    spriteY = spriteY[frameNo]
  } else if (isAnim) {
    let frameNo = Math.floor(cD.frameNo / animationSpeed) % spriteY.length
    spriteY = spriteY[frameNo]
  }
  if (rotation !== 0) {
    cD.context.translate(x + spriteWidth / 2, y + spriteHeight / 2)
    cD.context.rotate(rotation / 180 * Math.PI)
    cD.context.drawImage(
      cD.spritesheet,
      spriteX, spriteY, spriteWidth, spriteHeight,
      -spriteWidth / 2, -spriteHeight / 2, spriteWidth, spriteHeight
    )
    cD.context.rotate(-(rotation / 180 * Math.PI))
    cD.context.translate(-(x + spriteWidth / 2), -(y + spriteHeight / 2))
  } else {
    cD.context.drawImage(
      cD.spritesheet,
      spriteX, spriteY, spriteWidth, spriteHeight,
      x, y, spriteWidth, spriteHeight
    )
  }
}

/**
 * Draw a Sprite-Image onto the used canvas.
 * Its size is determined by the defined data of the given Sprite.
 * @param {number} x x-coordinate of the top-left corner
 * @param {number} y y-coordinate of the top-left corner
 * @param {string} spriteKey defines which sprite should be drawn
 * @param {CanvasDict} cD
 * @param {number} optWidth gets subtracted from the actual width
 * @param {number} optHeight gets subtracted from the actual height
 * @param {number} animationSpeed the speed of the animation, default: 12
 */
export function drawCanvasImagePart (x, y, spriteKey, cD, optWidth = 0, optHeight = 0, animationSpeed = 12) {
  let { full: spriteData } = getSpriteData(spriteKey, cD)
  let [isAnim, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData

  if (isAnim) {
    let frameNo = Math.floor(cD.frameNo / animationSpeed) % spriteY.length
    spriteY = spriteY[frameNo]
  }
  cD.context.drawImage(
    cD.spritesheet,
    spriteX, spriteY, Math.max(spriteWidth - optWidth, 0), Math.max(spriteHeight - optHeight, 0),
    x, y, Math.max(spriteWidth - optWidth, 0), Math.max(spriteHeight - optHeight, 0)
  )
}

/**
 * Return the width of text that will be on the canvas
 * @param {string} styleKey key of the used style
 * @param {string} text measured text
 * @param {CanvasRenderingContext2D} context context of the used canvas
 * @returns {TextMetrics} returns the width of the text
 */
export function getTextWidth (text, styleKey, context) {
  let style = Styles.text[styleKey]
  context.textAlign = style.align
  context.textBaseline = style.baseline
  context.font = style.font
  context.fillStyle = `rgba(${style.color})`
  return context.measureText(text)
}

/**
 * forms a circle to be clipped with corresponding functions
 * @param {number} centerX x-center of the circle
 * @param {number} centerY y-center of the circle
 * @param {number} radius radius of the circle
 * @param {CanvasRenderingContext2D} context context of the used canvas
 */
export function clipCanvasCircle (centerX, centerY, radius, context) {
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
}

/**
 * Draws a circle onto the used Canvas.
 * @param {number} centerX x-center of the circle
 * @param {number} centerY y-center of the circle
 * @param {number} radius radius of the circle
 * @param {string} styleKey defines the appearance of the circle
 * @param {CanvasRenderingContext2D} context context of the used canvas
 */
export function drawCanvasCircle (centerX, centerY, radius, styleKey, context) {
  let design = Styles.rect[styleKey]
  context.fillStyle = `rgba(${design.backgroundColor})`
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
  context.fill()
}
