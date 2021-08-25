import * as Helper from '@/canvas/helper.js'

let data = {
  arrowPos: {
    earth: 0,
    destination: 0
  },
  textPos: 0
}

export function update (that) {
  switch (that.$store.state.canvasDict.storyPart) {
    case 1:
    case 3:
      textUpdate(that)
      break
    case 2:
      arrowUpdate(that)
      break
    default:
  }
}

export function draw (that) {
  switch (that.$store.state.canvasDict.storyPart) {
    case 1:
    case 3:
      videoDraw(that)
      break
    case 2:
      mapDraw(that)
      break
    default:
  }
}

/**
 * updates the position of the text on the bottom of the screen
 * @param {Object} that The Vue-Adventure object
 */
function textUpdate (that) {
  let textLength = Helper.getTextWidth(
    that.$store.getters.getText('adventureStoryF0P1Text'), 'storyF0P1Text', that.$store.state.canvasDict.context
  )

  data.textPos -= 1

  if (Math.abs(data.textPos) >= textLength) {
    data.textPos = 0
  }
}

function arrowUpdate (that) {
  data.arrowPos.earth = 120 + Math.sin(that.$store.state.canvasDict.frameNo / 20) * 3
  data.arrowPos.destination = 35 + Math.sin(that.$store.state.canvasDict.frameNo / 20) * 3
}

function videoDraw (that) {
  const cD = that.$store.state.canvasDict
  let textLength = Helper.getTextWidth(
    that.$store.getters.getText('adventureStoryF0P1Text'), 'storyF0P1Text', cD.context
  )

  if (cD.storyWritesText) {
    Helper.drawCanvasImage(0, 0, 'story_videobackground_anim', cD, 8)
  } else {
    Helper.drawCanvasImage(0, 0, 'story_videobackground_1', cD)
  }

  Helper.drawCanvasText(
    data.textPos, 260, that.$store.getters.getText('adventureStoryF0P1Text'), 'storyF0P1Text', cD.context
  )
  Helper.drawCanvasText(
    data.textPos + Math.ceil(textLength), 260, that.$store.getters.getText('adventureStoryF0P1Text'),
    'storyF0P1Text', cD.context
  )
}

function mapDraw (that) {
  const cD = that.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_star_map', cD)
  Helper.drawCanvasImage(30, data.arrowPos.earth, 'story_red_arrow', cD)
  Helper.drawCanvasText(
    42.5, data.arrowPos.earth - 10, that.$store.getters.getText('adventureStoryF0P2Label1'),
    'storyF0P2StarMap', cD.context
  )
  Helper.drawCanvasImage(530, data.arrowPos.destination, 'story_red_arrow', cD)
  Helper.drawCanvasText(
    542.5, data.arrowPos.destination - 10, that.$store.getters.getText('adventureStoryF0P2Label2'),
    'storyF0P2StarMap', cD.context
  )
}
