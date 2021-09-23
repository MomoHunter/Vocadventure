import Styles from '@/canvas/styles.json'

/**
 * Draws a filled rectangle onto the used canvas
 * @param {number} x x-coordinate of the rectangle's top-left corner
 * @param {number} y y-coordinate of the rectangle's top-left corner
 * @param {number} width
 * @param {number} height
 * @param {string} styleKey defines the appearance of the rectangle
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 */
export function drawCanvasRect (x, y, width, height, styleKey, context) {
  let style = Styles.rect[styleKey]
  context.fillStyle = `rgba(${style.backgroundColor})`
  context.fillRect(x, y, width, height)
}

/**
 * Draws a border for a rectangle onto the used canvas.
 * @param {number} x x-coordinate of the rectangle's top-left corner
 * @param {number} y y-coordinate of the rectangle's top-left corner
 * @param {number} width
 * @param {number} height
 * @param {string} styleKey defines the appearance of the rectangle
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 */
export function drawCanvasRectBorder (x, y, width, height, styleKey, context) {
  let style = Styles.border[styleKey]
  context.strokeStyle = `rgba(${style.borderColor})`
  context.lineWidth = style.borderSize
  context.setLineDash(style.lineDash)
  context.strokeRect(x, y, width, height)
}

/**
 * Draws a border for a rectangle onto the used canvas.
 * @param {number} startX x-coordinate of the start point
 * @param {number} startY y-coordinate of the start point
 * @param {string} styleKey defines the appearance of the rectangle
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @param {Array<number>} points an array of points where the line should go through
 */
export function drawCanvasLine (startX, startY, styleKey, context, ...points) {
  let design = Styles.border[styleKey]
  context.strokeStyle = `rgba(${design.borderColor})`
  context.lineWidth = design.borderSize
  context.lineCap = design.borderCap
  context.setLineDash(design.lineDash)
  context.beginPath()
  context.moveTo(startX, startY)
  for (let i = 0; i < points.length / 2; i++) {
    if (points[i * 2] !== undefined && points[i * 2 + 1] !== undefined) {
      context.lineTo(points[i * 2], points[i * 2 + 1])
    } else {
      break
    }
  }
  context.stroke()
}

/**
 * Draw text onto the used canvas.
 * Its positioning is affected by the attributes saved inside the used Style-Key.
 * @param {number} x x-coordinate for the positioning point
 * @param {number} y y-coordinate for the positioning point
 * @param {string} text text to be written
 * @param {string} styleKey defines the appearance of the text
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
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
 * Draw text onto the used canvas with the option to resize it without changing the style.
 * Its positioning is affected by the attributes saved inside the used Style-Key.
 * @param {number} x x-coordinate for the positioning point
 * @param {number} y y-coordinate for the positioning point
 * @param {string} text text to be written
 * @param {string} styleKey defines the appearance of the text
 * @param {string} size the size of the text
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 */
export function drawCanvasTextResizable (x, y, text, styleKey, size, context) {
  let style = Styles.text[styleKey]
  context.textAlign = style.align
  context.textBaseline = style.baseline
  context.font = size + style.font
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
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
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
 * @param {number} rotation gives the rotation in degree
 */
export function drawCanvasImage (x, y, spriteKey, cD, animationSpeed = 12, customStart = 0, rotation = 0) {
  let { full: spriteData } = getSpriteData(spriteKey, cD)
  let [isAnim, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData

  if (isAnim) {
    let frameNo = Math.floor((cD.frameNo - customStart) / animationSpeed) % spriteY.length
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
 * Draws an animation once and then returns true
 * @param {number} x x-coordinate of the top-left corner
 * @param {number} y y-coordinate of the top-left corner
 * @param {string} spriteKey defines thich sprite should be drawn
 * @param {number} startFrame sets the startframe of the animation
 * @param {CanvasDict} cD
 * @param {number} animationSpeed the speed of the animation, default: 12
 * @returns {boolean} is animation finished
 */
export function drawCanvasImageOnce (x, y, spriteKey, cD, startFrame, animationSpeed = 12) {
  let { full: spriteData } = getSpriteData(spriteKey, cD)
  let [, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData
  let frames = spriteY.length

  let frameNo = Math.floor((cD.frameNo - startFrame) / animationSpeed) % frames
  spriteY = spriteY[frameNo]

  cD.context.drawImage(
    cD.spritesheet,
    spriteX, spriteY, spriteWidth, spriteHeight,
    x, y, spriteWidth, spriteHeight
  )

  return frameNo > 0 && Math.floor(((cD.frameNo + 1) - startFrame) / animationSpeed) % frames === 0
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
 * Draw a Sprite-Image onto the used canvas.
 * Its size is determined by the defined data of the given Sprite.
 * @param {number} x          x-coordinate of the top-left corner
 * @param {number} y          y-coordinate of the top-left corner
 * @param {number} percentage percentage for the new size from the old size between 0 and 1
 * @param {string} spriteKey  defines which sprite should be drawn
 * @param {CanvasDict} cD
 * @param {number} animationSpeed the speed of the animation, default: 12
 */
export function drawCanvasSmallImage (x, y, percentage, spriteKey, cD, animationSpeed = 12) {
  let { full: spriteData } = getSpriteData(spriteKey, cD)
  let [isAnim, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData

  if (isAnim) {
    let frameNo = Math.floor(cD.frameNo / animationSpeed) % spriteY.length
    spriteY = spriteY[frameNo]
  }

  cD.context.drawImage(
    cD.spritesheet,
    spriteX, spriteY, spriteWidth, spriteHeight,
    x, y, spriteWidth * percentage, spriteHeight * percentage
  )
}

/**
 * Return the width of text that will be on the canvas
 * @param {string} styleKey                  key of the used style
 * @param {string} text                      measured text
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @returns {TextMetrics}                    returns the width of the text
 */
export function getTextWidth (text, styleKey, context) {
  let style = Styles.text[styleKey]
  context.textAlign = style.align
  context.textBaseline = style.baseline
  context.font = style.font
  context.fillStyle = `rgba(${style.color})`
  return context.measureText(text).width
}

/**
 * forms a circle to be clipped with corresponding functions
 * @param {number} centerX x-center of the circle
 * @param {number} centerY y-center of the circle
 * @param {number} radius radius of the circle
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
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
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 */
export function drawCanvasCircle (centerX, centerY, radius, styleKey, context) {
  let design = Styles.rect[styleKey]
  context.fillStyle = `rgba(${design.backgroundColor})`
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
  context.fill()
}
