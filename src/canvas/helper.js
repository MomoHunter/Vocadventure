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
 * @param {number} opacity sets the opacity of the line
 */
export function drawCanvasRectBorder (x, y, width, height, styleKey, context, opacity = 1) {
  let style = Styles.border[styleKey]
  context.strokeStyle = `rgba(${style.borderColor}, ${opacity})`
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
 * @param {number} opacity sets the opacity of the line
 * @param {Array<number>} points an array of points where the line should go through
 */
export function drawCanvasLine (startX, startY, styleKey, context, opacity, ...points) {
  let design = Styles.border[styleKey]
  context.strokeStyle = `rgba(${design.borderColor}, ${opacity})`
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

export function drawCanvasLineCustom (startX, startY, color, width, cap, dash, context, ...points) {
  context.strokeStyle = color
  context.lineWidth = width
  context.lineCap = cap
  context.setLineDash(dash)
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
 * @param {number} opacity defines the opacity of the text
 */
export function drawCanvasText (x, y, text, styleKey, context, opacity = 1) {
  let style = Styles.text[styleKey]
  context.textAlign = style.align
  context.textBaseline = style.baseline
  context.font = style.font
  context.fillStyle = `rgba(${style.color}, ${opacity})`
  context.fillText(text, x, y)
  if (style.borderKey !== '') {
    drawCanvasTextBorder(x, y, text, style.borderKey, context, opacity)
  }
}

/**
 * Draw text onto the used canvas with the option to resize it without changing the style.
 * Its positioning is affected by the attributes saved inside the used Style-Key.
 * @param {number} x x-coordinate for the positioning point
 * @param {number} y y-coordinate for the positioning point
 * @param {string} text text to be written
 * @param {string} styleKey defines the appearance of the text
 * @param {number} size the size of the text
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @param {number} opacity defines the opacity of the text
 */
export function drawCanvasTextResizable (x, y, text, styleKey, size, context, opacity = 1) {
  let style = Styles.text[styleKey]
  context.textAlign = style.align
  context.textBaseline = style.baseline
  context.font = `${style.strength ?? ''} ${size}` + style.font
  context.fillStyle = `rgba(${style.color}, ${opacity})`
  context.fillText(text, x, y)
  if (style.borderKey !== '') {
    drawCanvasTextBorder(x, y, text, style.borderKey, context, opacity)
  }
}

/**
 * Draws text in a round shape
 * @param {number} centerX center x-coordinate of the circle
 * @param {number} centerY center y-coordinate of the circle
 * @param {number} refDeg reference degrees for positioning of the text
 * @param {number} radius radius of the circle
 * @param {string} text text to be written
 * @param {string} styleKey defines the appearance of the text
 * @param {number} frameNo the current frame number
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @param {number} opacity defines the opacity of the text
 */
export function drawCanvasTextRound (centerX, centerY, refDeg, radius, text, styleKey, frameNo, context, opacity = 1, animationSpeed = 8) {
  let style = Styles.text[styleKey]
  let letters = text.split('')
  let currentDeg = refDeg
  let perimeter = Math.PI * 2 * Math.abs(radius)

  context.textAlign = style.align
  context.textBaseline = style.baseline
  context.font = style.font
  if (typeof style.color === 'string') {
    context.fillStyle = `rgba(${style.color}, ${opacity})`
  }

  if (context.textAlign === 'center') {
    currentDeg = refDeg - ((context.measureText(text).width / perimeter) * 360) / 2
  } else if (context.textAlign === 'right') {
    currentDeg = refDeg - (context.measureText(text).width / perimeter) * 360
  }

  context.translate(centerX, centerY)
  letters.forEach((letter, index) => {
    let letterDeg = (context.measureText(letter).width / perimeter) * 360
    let rotateDeg = 0
    if (context.textAlign === 'center') {
      rotateDeg = letterDeg / 2
    } else if (context.textAlign === 'right') {
      rotateDeg = letterDeg
    }
    context.rotate((currentDeg + rotateDeg) / 180 * Math.PI)
    if (Array.isArray(style.color)) {
      context.fillStyle = `rgba(${
        style.color[(Math.floor(frameNo / animationSpeed) - index) % style.color.length]
      }, ${opacity})`
    }
    context.fillText(letter, 0, -radius)
    context.rotate(-((currentDeg + rotateDeg) / 180 * Math.PI))
    currentDeg += letterDeg
  })
  context.translate(-centerX, -centerY)

  if (style.borderKey !== '') {
    drawCanvasTextRoundBorder(centerX, centerY, refDeg, radius, text, style.borderKey, context, opacity)
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
 * @param {number} opacity defines the opacity of the text
 */
export function drawCanvasTextBorder (x, y, text, styleKey, context, opacity = 1) {
  let style = Styles.border[styleKey]
  context.strokeStyle = `rgba(${style.borderColor}, ${opacity})`
  context.lineWidth = style.borderSize
  context.setLineDash(style.lineDash)
  context.strokeText(text, x, y)
}

/**
 * Draws a border for text drawn in a round shape
 * @param {number} centerX center x-coordinate of the circle
 * @param {number} centerY center y-coordinate of the circle
 * @param {number} refDeg reference degrees for positioning of the text
 * @param {number} radius radius of the circle
 * @param {string} text text to be written
 * @param {string} styleKey defines the appearance of the text
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @param {number} opacity defines the opacity of the text
 */
export function drawCanvasTextRoundBorder (centerX, centerY, refDeg, radius, text, styleKey, context, opacity = 1) {
  let style = Styles.border[styleKey]
  let letters = text.split('')
  let currentDeg = refDeg
  let perimeter = Math.PI * 2 * Math.abs(radius)

  if (context.textAlign === 'center') {
    currentDeg = refDeg - ((context.measureText(text).width / perimeter) * 360) / 2
  } else if (context.textAlign === 'right') {
    currentDeg = refDeg - (context.measureText(text).width / perimeter) * 360
  }

  context.strokeStyle = `rgba(${style.borderColor}, ${opacity})`
  context.lineWidth = style.borderSize
  context.setLineDash(style.lineDash)

  context.translate(centerX, centerY)
  letters.forEach(letter => {
    let letterDeg = (context.measureText(letter).width / perimeter) * 360
    let rotateDeg = 0
    if (context.textAlign === 'center') {
      rotateDeg = letterDeg / 2
    } else if (context.textAlign === 'right') {
      rotateDeg = letterDeg
    }
    context.rotate((currentDeg + rotateDeg) / 180 * Math.PI)
    context.strokeText(letter, 0, -radius)
    context.rotate(-((currentDeg + rotateDeg) / 180 * Math.PI))
    currentDeg += letterDeg
  })
  context.translate(-centerX, -centerY)
}

/**
 * Retrieves sprite information, falling back to the placeholder image if needed.
 * @param {string} spriteKey the key of the sprite
 * @param {Object} spriteDict the dictionary of the positions of the sprites in the spritesheet
 * @return {{spriteWidth: number, spriteHeight: number, full: Array, key: string}}
 */
export function getSpriteData (spriteKey, spriteDict) {
  let spriteData = spriteDict[spriteKey]
  if (!spriteData) {
    console.error('Wrong key: ', spriteKey)
    spriteData = spriteDict['special_placeholder']
  }
  return { spriteWidth: spriteData[3], spriteHeight: spriteData[4], full: spriteData, key: spriteKey }
}

/**
 * Draw a Sprite-Image onto the used canvas.
 * Its size is determined by the defined data of the given Sprite.
 * @param {number} x x-coordinate of the top-left corner
 * @param {number} y y-coordinate of the top-left corner
 * @param {string} spriteKey defines which sprite should be drawn
 * @param {Object} spriteDict the dictionary of the positions of the sprites in the spritesheet
 * @param {number} frameNo the current frame number
 * @param {Image} spritesheet the spritesheet
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @param {number} animationSpeed the speed of the animation, default: 12
 * @param {boolean} useCustomStart if animation should count from cD.animationStartFrame
 * @param {number} rotation gives the rotation in degree
 */
export function drawCanvasImage (x, y, spriteKey, spriteDict, frameNo, spritesheet, context, animationSpeed = 12, customStart = 0, rotation = 0, rotationMode = 0, opacity = 1) {
  let { full: spriteData } = getSpriteData(spriteKey, spriteDict)
  let [isAnim, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData

  if (isAnim) {
    let spriteFrameNo = Math.floor((frameNo - customStart) / animationSpeed) % spriteX.length
    spriteX = spriteX[spriteFrameNo]
    spriteY = spriteY[spriteFrameNo]
  }

  if (opacity !== 1) {
    context.globalAlpha = opacity
  }

  if (rotation !== 0) {
    switch (rotationMode) {
      case 0:

        context.translate(x + spriteWidth / 2, y + spriteHeight / 2)
        context.rotate(rotation / 180 * Math.PI)
        context.drawImage(
          spritesheet,
          spriteX, spriteY, spriteWidth, spriteHeight,
          -spriteWidth / 2, -spriteHeight / 2, spriteWidth, spriteHeight
        )
        context.rotate(-(rotation / 180 * Math.PI))
        context.translate(-(x + spriteWidth / 2), -(y + spriteHeight / 2))
        break

      case 1:

        context.translate(x + spriteWidth / 2, y)
        context.rotate(rotation / 180 * Math.PI)
        context.drawImage(
          spritesheet,
          spriteX, spriteY, spriteWidth, spriteHeight,
          -spriteWidth / 2, 0, spriteWidth, spriteHeight
        )
        context.rotate(-(rotation / 180 * Math.PI))
        context.translate(-(x + spriteWidth / 2), -y)
        break

      default:

        context.rotate(rotation / 180 * Math.PI)
        context.drawImage(
          spritesheet,
          spriteX, spriteY, spriteWidth, spriteHeight,
          -spriteWidth / 2, -spriteHeight / 2, spriteWidth, spriteHeight
        )
        context.rotate(-(rotation / 180 * Math.PI))
    }
  } else {
    context.drawImage(
      spritesheet,
      spriteX, spriteY, spriteWidth, spriteHeight,
      x, y, spriteWidth, spriteHeight
    )
  }

  if (opacity !== 1) {
    context.globalAlpha = 1.0
  }
}

/**
 * Draws an animation once and then returns true
 * @param {number} x x-coordinate of the top-left corner
 * @param {number} y y-coordinate of the top-left corner
 * @param {string} spriteKey defines thich sprite should be drawn
 * @param {Object} spriteDict the dictionary of the positions of the sprites in the spritesheet
 * @param {number} frameNo the current frame number
 * @param {number} startFrame sets the startframe of the animation
 * @param {Image} spritesheet the spritesheet
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @param {number} animationSpeed the speed of the animation, default: 12
 * @returns {boolean} is animation finished
 */
export function drawCanvasImageOnce (x, y, spriteKey, spriteDict, frameNo, startFrame, spritesheet, context, animationSpeed = 12) {
  let { full: spriteData } = getSpriteData(spriteKey, spriteDict)
  let [, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData
  let frames = spriteX.length

  let spriteFrameNo = Math.floor((frameNo - startFrame) / animationSpeed) % frames
  spriteX = spriteX[spriteFrameNo]
  spriteY = spriteY[spriteFrameNo]

  context.drawImage(
    spritesheet,
    spriteX, spriteY, spriteWidth, spriteHeight,
    x, y, spriteWidth, spriteHeight
  )

  return spriteFrameNo > 0 && Math.floor(((frameNo + 1) - startFrame) / animationSpeed) % frames === 0
}

/**
 * Draw a Sprite-Image onto the used canvas.
 * Its size is determined by the defined data of the given Sprite.
 * @param {number} x x-coordinate of the top-left corner
 * @param {number} y y-coordinate of the top-left corner
 * @param {string} spriteKey defines which sprite should be drawn
 * @param {Object} spriteDict the dictionary of the positions of the sprites in the spritesheet
 * @param {number} frameNo the current frame number
 * @param {Image} spritesheet the spritesheet
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @param {number} optWidth gets subtracted from the actual width, default: 0
 * @param {number} optHeight gets subtracted from the actual height, default: 0
 * @param {number} animationSpeed the speed of the animation, default: 12
 */
export function drawCanvasImagePart (x, y, spriteKey, spriteDict, frameNo, spritesheet, context, optWidth = 0, optHeight = 0, animationSpeed = 12) {
  let { full: spriteData } = getSpriteData(spriteKey, spriteDict)
  let [isAnim, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData

  if (isAnim) {
    let spriteFrameNo = Math.floor(frameNo / animationSpeed) % spriteX.length
    spriteX = spriteX[spriteFrameNo]
    spriteY = spriteY[spriteFrameNo]
  }
  context.drawImage(
    spritesheet,
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
 * @param {Object} spriteDict the dictionary of the positions of the sprites in the spritesheet
 * @param {number} frameNo the current frame number
 * @param {Image} spritesheet the spritesheet
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @param {number} animationSpeed the speed of the animation, default: 12
 */
export function drawCanvasSmallImage (x, y, percentage, spriteKey, spriteDict, frameNo, spritesheet, context, animationSpeed = 12) {
  let { full: spriteData } = getSpriteData(spriteKey, spriteDict)
  let [isAnim, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData

  if (isAnim) {
    let spriteFrameNo = Math.floor(frameNo / animationSpeed) % spriteX.length
    spriteX = spriteX[spriteFrameNo]
    spriteY = spriteY[spriteFrameNo]
  }

  context.drawImage(
    spritesheet,
    spriteX, spriteY, spriteWidth, spriteHeight,
    x, y, spriteWidth * percentage, spriteHeight * percentage
  )
}

/**
 * Draws an animation once and then returns true
 * @param {number} x x-coordinate of the top-left corner
 * @param {number} y y-coordinate of the top-left corner
 * @param {number} percentage percentage for the new size from the old size between 0 and 1
 * @param {string} spriteKey defines thich sprite should be drawn
 * @param {number} startFrame sets the startframe of the animation
 * @param {Object} spriteDict the dictionary of the positions of the sprites in the spritesheet
 * @param {number} frameNo the current frame number
 * @param {Image} spritesheet the spritesheet
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @param {number} animationSpeed the speed of the animation, default: 12
 * @returns {boolean} is animation finished
 */
export function drawCanvasSmallImageOnce (x, y, percentage, spriteKey, spriteDict, frameNo, spritesheet, context, startFrame, animationSpeed = 12) {
  let { full: spriteData } = getSpriteData(spriteKey, spriteDict)
  let [, spriteX, spriteY, spriteWidth, spriteHeight] = spriteData
  let frames = spriteX.length

  let spriteFrameNo = Math.floor((frameNo - startFrame) / animationSpeed) % frames
  spriteX = spriteX[spriteFrameNo]
  spriteY = spriteY[spriteFrameNo]

  context.drawImage(
    spritesheet,
    spriteX, spriteY, spriteWidth, spriteHeight,
    x, y, spriteWidth * percentage, spriteHeight * percentage
  )

  return spriteFrameNo > 0 && Math.floor(((frameNo + 1) - startFrame) / animationSpeed) % frames === 0
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
 * Return the width of text that will be on the canvas
 * @param {string} styleKey                  key of the used style
 * @param {string} text                      measured text
 * @param {number} size                      size of text
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @returns {TextMetrics}                    returns the width of the text
 */
export function getTextWidthResizable (text, styleKey, size, context) {
  let style = Styles.text[styleKey]
  context.textAlign = style.align
  context.textBaseline = style.baseline
  context.font = `${style.strength ?? ''} ${size}` + style.font
  context.fillStyle = `rgba(${style.color})`
  return context.measureText(text).width
}

/**
 * forms a rectangle to be clipped with corresponding functions
 * @param {number} x x-coordinate of the top-left corner
 * @param {number} y y-coordinate of the top-left corner
 * @param {number} width width of the rectangle
 * @param {number} height height of the rectangle
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 */
export function clipCanvasRect (x, y, width, height, context) {
  context.beginPath()
  context.rect(x, y, width, height)
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
 * @param {number} opacity defines the opacity of the circle
 */
export function drawCanvasCircle (centerX, centerY, radius, styleKey, context, opacity = 1) {
  let design = Styles.rect[styleKey]
  context.fillStyle = `rgba(${design.backgroundColor}, ${opacity})`
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
  context.fill()
}

/**
 * Draws a circle onto the used Canvas, using custom designs.
 * @param {number} centerX x-center of the circle
 * @param {number} centerY y-center of the circle
 * @param {number} radius radius of the circle
 * @param {string} color defines the color of the circle
 * @param {CanvasRenderingContext2D} context the context of the canvas (canvas.getContext('2d'))
 * @param {number} opacity defines the opacity of the circle
 */
export function drawCanvasCircleCustom (centerX, centerY, radius, color, context, opacity = 1) {
  context.fillStyle = `rgba(${color}, ${opacity})`
  context.beginPath()
  context.arc(centerX, centerY, radius, 0, Math.PI * 2)
  context.fill()
}

