import * as Helper from '@/canvas/helper.js'

export const updateCalls = [
  eyeUpdate,
  arrowUpdate,
  eyeUpdate
]

export const drawCalls = [
  videoDraw,
  mapDraw,
  videoDraw
]

let data = {
  arrowPos: {
    earth: 0,
    destination: 0
  },
  eye: {
    counter: 100,
    startFrame: 0,
    finished: false
  }
}

export function update (that) {
  if (updateCalls[that.$store.state.canvasDict.storyPart - 1] !== null) {
    updateCalls[that.$store.state.canvasDict.storyPart - 1].call(that)
  }
}

export function draw (that) {
  if (drawCalls[that.$store.state.canvasDict.storyPart - 1] !== null) {
    drawCalls[that.$store.state.canvasDict.storyPart - 1].call(that)
  }
}

/**
 * updates the counter for the eye animation
 */
function eyeUpdate () {
  data.eye.counter -= 1
  if (data.eye.counter === 0) {
    data.eye.startFrame = this.$store.state.canvasDict.frameNo
  }
  if (data.eye.finished) {
    data.eye.finished = false
    data.eye.counter = Math.floor(Math.random() * 120) + 60
  }
}

/**
 * updates the arrow position for the star map
 */
function arrowUpdate () {
  data.arrowPos.earth = 120 + Math.sin(this.$store.state.canvasDict.frameNo / 20) * 3
  data.arrowPos.destination = 35 + Math.sin(this.$store.state.canvasDict.frameNo / 20) * 3
}

/**
 * draws the video with the guy speaking
 */
function videoDraw () {
  const cD = this.$store.state.canvasDict
  // let textLength = Helper.getTextWidth(
  //   that.$store.getters.getText('adventureStoryF0P1Text'), 'storyF0P1Text', cD.context
  // )

  Helper.drawCanvasImage(0, 0, 'story_video_background', cD)
  Helper.drawCanvasSmallImage(40, 30, 0.378, 'story_star_map', cD)
  Helper.drawCanvasImage(0, 0, 'story_video_foreground', cD)

  if (data.eye.counter <= 0) {
    data.eye.finished = Helper.drawCanvasImageOnce(283, 63, 'story_video_moderator_eyes', cD, data.eye.startFrame, 4)
  } else {
    Helper.drawCanvasImage(283, 63, 'story_video_moderator_eyes_open', cD)
  }

  if (cD.storyWritesText) {
    Helper.drawCanvasImage(292, 90, 'story_video_moderator_mouth', cD, 8)
  } else {
    Helper.drawCanvasImage(292, 90, 'story_video_moderator_mouth_closed', cD)
  }

  // Helper.drawCanvasText(
  //   data.textPos, 260, that.$store.getters.getText('adventureStoryF0P1Text'), 'storyF0P1Text', cD.context
  // )
  // Helper.drawCanvasText(
  //   data.textPos + Math.ceil(textLength), 260, that.$store.getters.getText('adventureStoryF0P1Text'),
  //   'storyF0P1Text', cD.context
  // )
}

/**
 * draws the star map with two arrows
 */
function mapDraw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_star_map', cD)
  Helper.drawCanvasImage(30, data.arrowPos.earth, 'story_red_arrow', cD)
  Helper.drawCanvasText(
    42.5, data.arrowPos.earth - 10, this.$store.getters.getText('adventureStoryF0P2Label1'),
    'storyF0P2StarMap', cD.context
  )
  Helper.drawCanvasImage(530, data.arrowPos.destination, 'story_red_arrow', cD)
  Helper.drawCanvasText(
    542.5, data.arrowPos.destination - 10, this.$store.getters.getText('adventureStoryF0P2Label2'),
    'storyF0P2StarMap', cD.context
  )
}
