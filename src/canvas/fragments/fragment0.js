import * as Helper from '@/canvas/helper.js'

export const updateCalls = [
  eyeUpdate,
  arrowUpdate,
  eyeUpdate,
  phoneZoomUpdate,
  phoneUpdate,
  phoneShiftUpdate,
  ceilingUpdate,
  pictureUpdate,
  ceilingUpdate,
  standUpUpdate,
  clockUpdate,
  clock2Update,
  woogleUpdate
]

export const drawCalls = [
  videoDraw,
  mapDraw,
  videoDraw,
  phoneZoomDraw,
  phoneZoomDraw,
  phoneZoomDraw,
  phoneZoomDraw,
  pictureDraw,
  phoneZoomDraw,
  phoneZoomDraw,
  clockDraw,
  clockDraw,
  woogleDraw
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
  },
  phone: {
    zoom: 0,
    shift: {
      x: 0,
      y: 0
    },
    shake: 0,
    textShift: 0
  },
  pictureZoom: 0,
  handShift: 0,
  pause: 0,
  clock: {
    multiplicator: 1,
    hour: 180,
    minute: 180,
    second: 180,
    years: 0,
    manipulated: false
  },
  woogle: {
    cars: [
      {
        x: 450,
        y: 200,
        spriteKey: 'story_f0_woogle_truck',
        directionUp: true
      }
    ],
    newCarCountdown: 100
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
  data.arrowPos.earth = 100 + Math.sin(this.$store.state.canvasDict.frameNo / 20) * 3
  data.arrowPos.destination = 35 + Math.sin(this.$store.state.canvasDict.frameNo / 20) * 3
}

/**
 * updates the zooming of the phone scene
 */
function phoneZoomUpdate () {
  if (data.phone.zoom < 300) {
    data.phone.zoom += 1
    data.phone.zoom *= 1.01
    if (data.phone.zoom > 300) {
      data.phone.zoom = 300
    }
    eyeUpdate.call(this)
  } else {
    this.$store.commit('canvasDict/setStoryPart', this.$store.state.canvasDict.storyPart + 1)
  }
}

/**
 * updates the size, if skipped, and the eyes
 */
function phoneUpdate () {
  if (data.phone.zoom < 300) {
    data.phone.zoom = 300
  }
  eyeUpdate.call(this)
}

/**
 * updates shift to the top
 */
function phoneShiftUpdate () {
  if (data.phone.shift.y < 400) {
    data.phone.shift.y += 1
    data.phone.shift.y *= 1.045
    if (data.phone.shift.y > 400) {
      data.phone.shift.y = 400
    }
  } else if (data.phone.shake <= 9) {
    if (data.phone.shake < 3) {
      data.phone.shift.x = 10
    } else if (data.phone.shake < 6) {
      data.phone.shift.y = 410
      data.phone.shift.x = 0
    } else if (data.phone.shake < 9) {
      data.phone.shift.y = 400
      data.phone.shift.x = -10
    } else {
      data.phone.shift.y = 400
      data.phone.shift.x = 0
    }
    data.phone.shake += 1
  } else {
    this.$store.commit('canvasDict/setStoryPart', this.$store.state.canvasDict.storyPart + 1)
  }

  phoneUpdate.call(this)
}

function ceilingUpdate () {
  if (data.phone.shift.y !== 400) {
    data.phone.shift.y = 400
  }
  if (data.phone.shift.x !== 0) {
    data.phone.shift.x = 0
  }
}

/**
 * updates the zooming on the picture of the parents
 */
function pictureUpdate () {
  data.pictureZoom += 1
}

function standUpUpdate () {
  if (data.phone.shift.y > 0) {
    data.phone.shift.y -= 1
    data.phone.shift.y *= 0.98
    if (data.phone.shift.y < 0) {
      data.phone.shift.y = 0
    }
  } else if (data.handShift < 167 && data.phone.zoom === 300 && data.pause === 0) {
    data.handShift += 4
    if (data.handShift > 167) {
      data.handShift = 167
    }
  } else if (data.pause < 20) {
    data.pause += 1
  } else if (data.handShift > 60) {
    data.handShift -= 4
  } else if (data.phone.zoom > 0) {
    data.phone.zoom -= 1
    data.phone.zoom = 300 - ((300 - data.phone.zoom) * 1.1)
    data.handShift -= 12
    if (data.phone.zoom < 0) {
      data.phone.zoom = 0
    }
  } else if (data.pause < 60) {
    data.pause += 1
  } else if (data.phone.textShift < 60) {
    data.phone.textShift += 1
    if (data.phone.textShift === 60) {
      this.$store.commit('canvasDict/setStoryPart', this.$store.state.canvasDict.storyPart + 1)
    }
  }
}

function clockUpdate () {
  if (data.pause < 60) {
    data.pause = 60
  }
  if (data.pause < 90) {
    data.pause += 1
  } else {
    data.clock.hour = (data.clock.hour - (data.clock.multiplicator * 0.008)) % 360
    data.clock.minute = (data.clock.minute - (data.clock.multiplicator * 0.1)) % 360
    data.clock.second = (data.clock.second - (data.clock.multiplicator * 6)) % 360
    if (data.clock.years <= 24.5) {
      data.clock.multiplicator *= 1.02
    } else if (data.clock.multiplicator > 1) {
      if (!data.clock.manipulated) {
        data.clock.hour -= 113.5
        data.clock.minute += 23.5
        data.clock.second -= 36
        data.clock.manipulated = true
      }
      data.clock.multiplicator /= 1.02
    } else {
      data.clock.multiplicator = 0
      data.clock.hour = 180
      data.clock.minute = 180
      data.clock.second = 180
      data.clock.years = 50
      this.$store.commit('canvasDict/setStoryPart', this.$store.state.canvasDict.storyPart + 1)
    }
    data.clock.years += data.clock.multiplicator / 7000
  }
}

function clock2Update () {
  if (data.clock.years !== 50) {
    data.clock.hour = 180
    data.clock.minute = 180
    data.clock.second = 180
    data.clock.years = 50
    data.pause = 90
  }
}

function woogleUpdate () {
  for (let car of data.woogle.cars) {
    if (car.directionUp) {
      car.x += 4
      car.y -= 1
    } else {
      car.x -= 4
      car.y += 1
    }
  }

  data.woogle.cars = data.woogle.cars.filter(car =>
    (car.directionUp && car.x < this.canvasWidth) || (!car.directionUp && car.y < this.canvasHeight)
  )

  data.woogle.newCarCountdown -= 1

  if (data.woogle.newCarCountdown <= 0) {
    if (Math.random() < 0.5) {
      const spriteKeys = ['story_f0_woogle_truck']

      let spriteData = Helper.getSpriteData(
        spriteKeys[Math.floor(spriteKeys.length * Math.random())], this.$store.state.canvasDict
      )
      data.woogle.cars.push({
        x: 180 - spriteData.spriteWidth,
        y: 300,
        spriteKey: spriteData.key,
        directionUp: true
      })
    } else {
      const spriteKeys = ['story_f0_woogle_car']

      data.woogle.cars.unshift({
        x: 600,
        y: 170,
        spriteKey: spriteKeys[Math.floor(spriteKeys.length * Math.random())],
        directionUp: false
      })
    }
    data.woogle.newCarCountdown = Math.floor(60 * Math.random()) + 40
  }
}

/**
 * draws the video with the guy speaking
 */
function videoDraw (zoom = 1, yShift = 0) {
  const cD = this.$store.state.canvasDict
  let halfWidth = this.canvasWidth / 2
  let halfHeight = this.canvasHeight / 2

  Helper.drawCanvasSmallImage(
    halfWidth * (1 - zoom), halfHeight * (1 - zoom) + yShift, zoom, 'story_f0_video_background', cD
  )
  Helper.drawCanvasSmallImage(
    halfWidth - (260 * zoom), halfHeight - (120 * zoom) + yShift, 0.378 * zoom, 'story_f0_star_map', cD
  )
  Helper.drawCanvasSmallImage(
    halfWidth * (1 - zoom), halfHeight * (1 - zoom) + yShift, zoom, 'story_f0_video_foreground', cD
  )

  if (data.eye.counter <= 0) {
    data.eye.finished = Helper.drawCanvasSmallImageOnce(
      halfWidth - (17 * zoom), halfHeight - (87 * zoom) + yShift, zoom, 'story_f0_video_moderator_eyes', cD,
      data.eye.startFrame, 4
    )
  } else {
    Helper.drawCanvasSmallImage(
      halfWidth - (17 * zoom), halfHeight - (87 * zoom) + yShift, zoom, 'story_f0_video_moderator_eyes_open', cD
    )
  }

  if (cD.storyWritesText) {
    Helper.drawCanvasSmallImage(
      halfWidth - (8 * zoom), halfHeight - (60 * zoom) + yShift, zoom, 'story_f0_video_moderator_mouth', cD, 8
    )
  } else {
    Helper.drawCanvasSmallImage(
      halfWidth - (8 * zoom), halfHeight - (60 * zoom) + yShift, zoom, 'story_f0_video_moderator_mouth_closed', cD
    )
  }
}

/**
 * draws the star map with two arrows
 */
function mapDraw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_f0_star_map', cD)
  Helper.drawCanvasImage(49, data.arrowPos.earth, 'story_f0_red_arrow', cD)
  Helper.drawCanvasText(
    61.5, data.arrowPos.earth - 10, this.$store.getters.getText('adventureStoryF0P2Label1'),
    'storyF0P2StarMap', cD.context
  )
  Helper.drawCanvasImage(530, data.arrowPos.destination, 'story_f0_red_arrow', cD)
  Helper.drawCanvasText(
    542.5, data.arrowPos.destination - 10, this.$store.getters.getText('adventureStoryF0P2Label2'),
    'storyF0P2StarMap', cD.context
  )
}

/**
 * draws the phone and the extra screen while they zoom out, also shifting to the ceiling
 */
function phoneZoomDraw () {
  const cD = this.$store.state.canvasDict
  let zoom = data.phone.zoom * (2.5 / 300)

  Helper.drawCanvasSmallImage(
    -(this.canvasWidth * ((61 / 24) - zoom * (61 / 60))) - ((10 - data.phone.shift.x) * (3.5 - zoom)),
    -(this.canvasHeight * ((71 / 12) - zoom * (71 / 30))) - ((410 - data.phone.shift.y) * (3.5 - zoom)),
    6 - zoom * 2, 'story_f0_smartphone', cD
  )
  if (this.$store.state.canvasDict.storyPart < 8) {
    videoDraw.call(this, 1 - (data.phone.zoom * ((5 / 6) / 300)), data.phone.shift.y)
  } else {
    let halfWidth = this.canvasWidth / 2
    let halfHeight = this.canvasHeight / 2
    let videoZoom = 1 - (data.phone.zoom * ((5 / 6) / 300))

    Helper.drawCanvasSmallImage(
      halfWidth * (1 - videoZoom), halfHeight * (1 - videoZoom) + data.phone.shift.y, videoZoom,
      'story_f0_video_start_background', cD
    )
    if (data.pause < 30) {
      Helper.drawCanvasSmallImage(
        halfWidth - 50 * videoZoom, halfHeight - 50 * videoZoom + data.phone.shift.y, videoZoom,
        'story_f0_video_start_button', cD
      )
    }

    Helper.drawCanvasSmallImage(
      -107 + data.handShift, 300 - data.handShift + data.phone.shift.y, 6 - zoom * 2, 'story_f0_hand', cD
    )
    Helper.drawCanvasTextResizable(
      halfWidth * (1 - videoZoom) + 10 * videoZoom,
      halfHeight * (1 - videoZoom) + data.phone.shift.y + 10 * videoZoom - data.phone.textShift,
      this.$store.getters.getText('adventureStoryF0P10Title'), 'storyF0P10VideoTitle', (14 * videoZoom).toString(),
      cD.context
    )
  }
}

/**
 * draw the phone and the extra screen zoomed out
 */
function pictureDraw () {
  const cD = this.$store.state.canvasDict
  let zoom = (Math.sin(data.pictureZoom / 750) + 1) / 2

  Helper.drawCanvasSmallImage(-zoom * 40, -zoom * 20, 1 - ((1 - zoom) * (2 / 17)), 'story_f0_parents', cD)
}

function clockDraw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_f0_video_clock_base', cD)
  Helper.drawCanvasImage(this.canvasWidth / 2 - 5, 175, 'story_f0_video_clock_hour', cD, 12, 0, data.clock.hour, 1)
  Helper.drawCanvasImage(this.canvasWidth / 2 - 4, 175, 'story_f0_video_clock_minute', cD, 12, 0, data.clock.minute, 1)
  Helper.drawCanvasImage(this.canvasWidth / 2 - 1, 175, 'story_f0_video_clock_second', cD, 12, 0, data.clock.second, 1)
  Helper.drawCanvasImage(this.canvasWidth / 2 - 5, 170, 'story_f0_video_clock_center', cD)

  if (data.clock.years > 0.5) {
    Helper.drawCanvasText(
      this.canvasWidth / 2, 40,
      this.$store.getters.getText('adventureStoryF0P11Before', Math.floor(data.clock.years)),
      'storyF0P11VideoText', cD.context
    )
  } else {
    Helper.drawCanvasText(
      this.canvasWidth / 2, 40, this.$store.getters.getText('adventureStoryF0P11Today'), 'storyF0P11VideoText',
      cD.context
    )
  }
}

function woogleDraw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_f0_woogle', cD)

  for (let car of data.woogle.cars) {
    Helper.drawCanvasImage(car.x, car.y, car.spriteKey, cD)
  }
}
