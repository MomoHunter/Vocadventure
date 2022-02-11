import * as Helper from '@/canvas/helper.js'

export const updateCalls = [
  p1Update,
  p2Update,
  p1Update,
  p4Update,
  phoneUpdate,
  phoneShiftUpdate,
  ceilingUpdate,
  pictureUpdate,
  ceilingUpdate,
  standUpUpdate,
  clockUpdate,
  clock2Update,
  woogleUpdate,
  chromanderUpdate,
  chromander2Update,
  chromeParkUpdate,
  constructionUpdate,
  diagramUpdate,
  entryChromeleonUpdate,
  p20Update
]

export const drawCalls = [
  p1Draw,
  p2Draw,
  p1Draw,
  p4Draw,
  p4Draw,
  p4Draw,
  p4Draw,
  pictureDraw,
  p4Draw,
  p4Draw,
  clockDraw,
  clockDraw,
  woogleDraw,
  chromanderDraw,
  chromanderDraw,
  chromeParkDraw,
  constructionDraw,
  diagramDraw,
  entryChromeleonDraw,
  p20Draw
]

let data = {
  p1: {
    con: {
      textSize: 12
    },
    dyn: {
      eye: {
        counter: 100,
        startFrame: 0,
        finished: false
      },
      textPos: 0
    }
  },
  p2: {
    dyn: {
      arrowPos: {
        earth: 0,
        destination: 0
      }
    }
  },
  p4: {
    con: {
      starSpeed: 0.1,
      maxZoom: 300,
      referenceY: 163
    },
    dyn: {
      stars: [],
      zoom: 0,
      shift: {
        x: 0,
        y: 0
      }
    }
  },
  phone: {
    zoom: 0,
    shift: {
      x: 0,
      y: 0
    },
    shake: 0,
    textShift: 0,
    stars: []
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
  },
  chromander: {
    pause: 0,
    opacity: {
      nowNew: 0,
      headline: 0,
      logo: 0,
      bottomText: 0,
      eye: 0
    },
    logoRotation: 0
  },
  chromePark: {
    pause: 0,
    shift: 0,
    opacity: 0
  },
  construction: {
    roller: {
      shift: 150,
      startFrame: 0,
      pause: 0
    },
    crane: {
      rope: 0,
      shift: 0,
      pause: 0
    },
    tree: {
      x: 0,
      y: 0
    }
  },
  diagram: {
    factor: 0
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
 * lets the eye of the speaker blink, scrolls the text at the bottom
 * @param {number} zoom zoom factor for screen
 */
function p1Update (zoom = 1) {
  const cD = this.$store.state.canvasDict
  const textLength = Helper.getTextWidthResizable(
    this.$store.getters.getText('adventureStoryF0P1Text'), 'storyF0P1Text', data.p1.con.textSize * zoom, cD.context
  )

  data.p1.dyn.eye.counter -= 1
  if (data.p1.dyn.eye.counter === 0) {
    data.p1.dyn.eye.startFrame = cD.frameNo
  }
  if (data.p1.dyn.eye.finished) {
    data.p1.dyn.eye.finished = false
    data.p1.dyn.eye.counter = Math.floor(Math.random() * 120) + 60
  }

  data.p1.dyn.textPos -= zoom

  if (Math.abs(data.p1.dyn.textPos) >= textLength) {
    data.p1.dyn.textPos = 0
  }
}

/**
 * draws the video with the guy speaking and everything that belongs to it
 * @param {number} zoom zoom factor for screen
 * @param {number} yShift shift distance of the screen in negative y-direction
 */
function p1Draw (zoom = 1, yShift = 0) {
  const cD = this.$store.state.canvasDict
  const textLength = Helper.getTextWidthResizable(
    this.$store.getters.getText('adventureStoryF0P1Text'), 'storyF0P1Text', data.con.textSize * zoom, cD.context
  )
  const negZoom = 1 - zoom

  let halfWidth = this.canvasWidth / 2
  let halfHeight = this.canvasHeight / 2

  Helper.drawCanvasSmallImage(
    halfWidth * negZoom, halfHeight * negZoom + yShift, zoom, 'story_f0_video_background', cD
  )
  Helper.drawCanvasSmallImage(
    halfWidth - (260 * zoom), halfHeight - (120 * zoom) + yShift, 0.378 * zoom, 'story_f0_star_map', cD
  )
  Helper.drawCanvasSmallImage(
    halfWidth * negZoom, halfHeight * negZoom + yShift, zoom, 'story_f0_video_foreground', cD
  )

  if (data.p1.dyn.eye.counter <= 0) {
    data.p1.dyn.eye.finished = Helper.drawCanvasSmallImageOnce(
      halfWidth + (127 * zoom), halfHeight - (87 * zoom) + yShift, zoom, 'story_f0_video_moderator_eyes', cD,
      data.p1.dyn.eye.startFrame, 4
    )
  } else {
    Helper.drawCanvasSmallImage(
      halfWidth + (127 * zoom), halfHeight - (87 * zoom) + yShift, zoom, 'story_f0_video_moderator_eyes_open', cD
    )
  }

  if (cD.storyWritesText) {
    Helper.drawCanvasSmallImage(
      halfWidth + (136 * zoom), halfHeight - (60 * zoom) + yShift, zoom, 'story_f0_video_moderator_mouth', cD, 8
    )
  } else {
    Helper.drawCanvasSmallImage(
      halfWidth + (136 * zoom), halfHeight - (60 * zoom) + yShift, zoom, 'story_f0_video_moderator_mouth_closed', cD
    )
  }

  Helper.drawCanvasTextResizable(
    halfWidth - (259 * zoom), halfHeight + (-4 * zoom) + yShift,
    this.$store.getters.getText('adventureStoryF0P1TitleSmall'), 'storyF0P1Title', 9 * zoom, cD.context
  )
  Helper.drawCanvasTextResizable(
    halfWidth - (260 * zoom), halfHeight + (5 * zoom) + yShift, this.$store.getters.getText('adventureStoryF0P1Title'),
    'storyF0P1Title', 20 * zoom, cD.context
  )

  cD.context.save()

  Helper.clipCanvasRect(
    halfWidth * negZoom, halfHeight * negZoom + yShift, this.canvasWidth * zoom, this.canvasHeight * zoom, cD.context
  )

  cD.context.clip()

  Helper.drawCanvasTextResizable(
    data.p1.dyn.textPos + halfWidth * negZoom, halfHeight + (120 * zoom) + yShift,
    this.$store.getters.getText('adventureStoryF0P1Text'), 'storyF0P1Text', data.p1.con.textSize * zoom, cD.context
  )
  Helper.drawCanvasTextResizable(
    data.p1.dyn.textPos + Math.ceil(textLength) + halfWidth * negZoom, halfHeight + (120 * zoom) + yShift,
    this.$store.getters.getText('adventureStoryF0P1Text'), 'storyF0P1Text', data.p1.con.textSize * zoom, cD.context
  )

  cD.context.restore()
}

/**
 * moves the arrow position on the star map
 */
function p2Update () {
  data.p2.dyn.arrowPos.earth = 100 + Math.sin(this.$store.state.canvasDict.frameNo / 20) * 3
  data.p2.dyn.arrowPos.destination = 35 + Math.sin(this.$store.state.canvasDict.frameNo / 20) * 3
}

/**
 * draws the star map with two arrows
 */
function p2Draw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_f0_star_map', cD)
  Helper.drawCanvasImage(49, data.p2.dyn.arrowPos.earth, 'story_f0_red_arrow', cD)
  Helper.drawCanvasText(
    61.5, data.p2.dyn.arrowPos.earth - 10, this.$store.getters.getText('adventureStoryF0P2Label1'),
    'storyF0P2StarMap', cD.context
  )
  Helper.drawCanvasImage(530, data.p2.dyn.arrowPos.destination, 'story_f0_red_arrow', cD)
  Helper.drawCanvasText(
    542.5, data.p2.dyn.arrowPos.destination - 10, this.$store.getters.getText('adventureStoryF0P2Label2'),
    'storyF0P2StarMap', cD.context
  )
}

/**
 * zooms out of the screen (center of window 222, 824)
 */
function p4Update () {
  p4addStars()
  for (let star of data.p4.dyn.stars) {
    star.x -= data.p4.con.starSpeed
  }
  if (data.p4.dyn.zoom < data.p4.con.maxZoom) {
    data.p4.dyn.zoom += 1
    data.p4.dyn.zoom *= 1.01
    if (data.p4.dyn.zoom > data.p4.con.maxZoom) {
      data.p4.dyn.zoom = data.p4.con.maxZoom
    }
    p1Update.call(this, 1 - (data.p4.dyn.zoom * ((5 / 6) / data.p4.con.maxZoom)))
  } else {
    this.$store.commit('canvasDict/setStoryPart', this.$store.state.canvasDict.storyPart + 1)
  }
}

/**
 * draws the phone and the extra screen while they zoom out, also shifting to the ceiling and back and into the phone again
 */
function p4Draw () {
  const cD = this.$store.state.canvasDict

  let zoom = data.p4.dyn.zoom * (2.5 / data.p4.con.maxZoom)
  let actualZoom = (3.5 - zoom)
  let halfWidth = this.canvasWidth / 2
  let halfHeight = this.canvasHeight / 2

  Helper.drawCanvasRect(0, 0, this.canvasWidth, this.canvasHeight, 'storyF0P4Space', cD.context)
  for (let star of data.p4.dyn.stars) {
    let spriteData = Helper.getSpriteData(star.spriteKey, cD)
    let spriteZoom = ((star.x - 222) / 378)

    let distFromCenter = (star.startY - data.p4.con.referenceY) * spriteZoom * actualZoom
    let halfSpriteHeight = (spriteData.spriteHeight * spriteZoom) / 2

    Helper.drawCanvasSmallImage(
      halfWidth + (star.x - halfWidth) * actualZoom - ((spriteData.spriteWidth * spriteZoom) / 2),
      data.p4.con.referenceY + distFromCenter - halfSpriteHeight + data.p4.dyn.shift.y,
      spriteZoom * actualZoom, star.spriteKey, cD
    )
  }
  Helper.drawCanvasSmallImage(
    -(this.canvasWidth * ((61 / 24) - zoom * (61 / 60))) - ((10 - data.p4.dyn.shift.x) * actualZoom),
    -(this.canvasHeight * ((961 / 120) - zoom * (961 / 300))) - ((661 - data.p4.dyn.shift.y) * actualZoom),
    6 - zoom * 2, 'story_f0_smartphone', cD
  )

  if (this.$store.state.canvasDict.storyPart < 8) {
    p1Draw.call(this, 1 - (data.p4.dyn.zoom * ((5 / 6) / data.p4.con.maxZoom)), data.p4.dyn.shift.y)
  } else {
    let videoZoom = 1 - (data.p4.dyn.zoom * ((5 / 6) / data.p4.con.maxZoom))

    Helper.drawCanvasSmallImage(
      halfWidth * (1 - videoZoom), halfHeight * (1 - videoZoom) + data.p4.dyn.shift.y, videoZoom,
      'story_f0_video_start_background', cD
    )
    if (data.pause < 30) {
      Helper.drawCanvasSmallImage(
        halfWidth - 50 * videoZoom, halfHeight - 50 * videoZoom + data.p4.dyn.shift.y, videoZoom,
        'story_f0_video_start_button', cD
      )
    }

    Helper.drawCanvasSmallImage(
      -139 + data.handShift, 300 - data.handShift + data.p4.dyn.shift.y, 6 - zoom * 2, 'story_f0_hand', cD
    )
    Helper.drawCanvasTextResizable(
      halfWidth * (1 - videoZoom) + 10 * videoZoom,
      halfHeight * (1 - videoZoom) + data.p4.dyn.shift.y + 10 * videoZoom - data.p4.dyn.textShift,
      this.$store.getters.getText('adventureStoryF0P10Title'), 'storyF0P10VideoTitle', 14 * videoZoom,
      cD.context
    )
  }
}

/**
 * adds stars to the sky outside the window
 */
function p4addStars () {
  data.p4.dyn.stars = data.p4.dyn.stars.filter(star => star.x > 300)
  if (data.p4.dyn.stars.length === 0) {
    for (let i = 0; i < 50; i++) {
      let spriteKey = ''
      if (Math.random() < 0.8) {
        spriteKey = 'story_f0_smartphone_star_small_' + Math.floor(Math.random() * 8)
      } else {
        spriteKey = 'story_f0_smartphone_star_big_' + Math.floor(Math.random() * 8)
      }
      data.p4.dyn.stars.push({
        spriteKey: spriteKey,
        x: 300 + Math.random() * 300,
        startY: (Math.random() * 550) - 220
      })
    }
  } else if (Math.random() < 0.03) {
    let spriteKey = ''
    if (Math.random() < 0.8) {
      spriteKey = 'story_f0_smartphone_star_small_' + Math.floor(Math.random() * 8)
    } else {
      spriteKey = 'story_f0_smartphone_star_big_' + Math.floor(Math.random() * 8)
    }
    data.p4.dyn.stars.push({
      spriteKey: spriteKey,
      x: 620,
      startY: (Math.random() * 550) - 220
    })
  }
}

/**
 * updates the size, if skipped, and the eyes
 */
function phoneUpdate () {
  if (data.phone.zoom < data.p4.con.maxZoom) {
    data.phone.zoom = data.p4.con.maxZoom
  }
  addStars()
  p1Update.call(this, 1 - (data.phone.zoom * ((5 / 6) / 300)))
  for (let star of data.phone.stars) {
    star.x -= 0.1
  }
}

/**
 * updates shift to the top
 */
function phoneShiftUpdate () {
  if (data.phone.shift.y < 651) {
    data.phone.shift.y += 1
    data.phone.shift.y *= 1.045
    if (data.phone.shift.y > 651) {
      data.phone.shift.y = 651
    }
  } else if (data.phone.shake <= 9) {
    if (data.phone.shake < 3) {
      data.phone.shift.x = 10
    } else if (data.phone.shake < 6) {
      data.phone.shift.y = 661
      data.phone.shift.x = 0
    } else if (data.phone.shake < 9) {
      data.phone.shift.y = 651
      data.phone.shift.x = -10
    } else {
      data.phone.shift.y = 651
      data.phone.shift.x = 0
    }
    data.phone.shake += 1
  } else {
    this.$store.commit('canvasDict/setStoryPart', this.$store.state.canvasDict.storyPart + 1)
  }

  phoneUpdate.call(this)
}

function ceilingUpdate () {
  if (data.phone.shift.y !== 651) {
    data.phone.shift.y = 651
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
  addStars()
  for (let star of data.phone.stars) {
    star.x -= 0.1
  }
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

function chromanderUpdate () {
  if (data.chromander.pause < 30) {
    data.chromander.pause += 1
  } else if (data.chromander.opacity.nowNew < 1 && data.chromander.pause === 30) {
    data.chromander.opacity.nowNew += 0.05
  } else if (data.chromander.pause < 90) {
    data.chromander.pause += 1
  } else if (data.chromander.opacity.nowNew > 0 && data.chromander.pause === 90) {
    data.chromander.opacity.nowNew -= 0.05
  } else if (data.chromander.opacity.headline < 1) {
    data.chromander.opacity.headline += 0.05
  } else if (data.chromander.pause < 120) {
    data.chromander.pause += 1
  } else if (data.chromander.opacity.logo < 1) {
    data.chromander.opacity.logo += 0.05
    if (data.chromander.opacity.logo > 1) {
      data.chromander.opacity.logo = 1
    }
  } else if (data.chromander.pause < 150) {
    data.chromander.pause += 1
  } else if (data.chromander.opacity.bottomText < 1) {
    data.chromander.opacity.bottomText += 0.05
  } else if (data.chromander.pause < 300) {
    data.chromander.pause += 1
  } else if (data.chromander.opacity.eye < 1) {
    data.chromander.opacity.eye += 0.005
    if (data.chromander.opacity.eye > 1) {
      data.chromander.opacity.eye = 1
    }
  } else {
    this.$store.commit('canvasDict/setStoryPart', this.$store.state.canvasDict.storyPart + 1)
  }

  if (data.chromander.opacity.logo > 0) {
    data.chromander.logoRotation += 1
    data.chromander.logoRotation %= 360
  }
}

function chromander2Update () {
  if (data.chromander.opacity.nowNew > 0) {
    data.chromander.opacity.nowNew = 0
  }
  if (data.chromander.opacity.headline < 1) {
    data.chromander.opacity.headline = 1
  }
  if (data.chromander.opacity.logo < 1) {
    data.chromander.opacity.logo = 1
  }
  if (data.chromander.opacity.bottomText < 1) {
    data.chromander.opacity.bottomText = 1
  }
  if (data.chromander.opacity.eye < 1) {
    data.chromander.opacity.eye = 1
  }

  if (data.chromander.opacity.logo > 0) {
    data.chromander.logoRotation += 1
    data.chromander.logoRotation %= 360
  }
}

function chromeParkUpdate () {
  if (data.chromePark.pause < 60) {
    data.chromePark.pause += 1
  } else if (data.chromePark.shift < 150) {
    data.chromePark.shift += 2
  } else if (data.chromePark.opacity < 1) {
    data.chromePark.opacity += 0.01
    if (data.chromePark.opacity > 1) {
      data.chromePark.opacity = 1
    }
  }
}

function constructionUpdate () {
  let frames = this.$store.state.canvasDict.frameNo - data.construction.roller.startFrame

  if (frames / 200 < Math.PI * 2) {
    data.construction.roller.shift = Math.cos(frames / 200) * 150
  } else if (data.construction.roller.pause < 240) {
    data.construction.roller.pause += 1
  } else {
    data.construction.roller.pause = 0
    data.construction.roller.startFrame = this.$store.state.canvasDict.frameNo
  }

  if (data.construction.crane.shift < 55 && data.construction.crane.pause === 0) {
    data.construction.crane.shift += 0.3
    if (data.construction.crane.shift > 55) {
      data.construction.crane.shift = 55
    }
    data.construction.tree.x = data.construction.crane.shift
  } else if (data.construction.crane.rope < 20 && data.construction.crane.pause === 0) {
    data.construction.crane.rope += 0.3
    if (data.construction.crane.rope > 20) {
      data.construction.crane.rope = 20
    }
    data.construction.tree.y = data.construction.crane.rope
  } else if (data.construction.crane.pause < 60) {
    data.construction.crane.pause += 1
  } else if (data.construction.crane.rope > 0 && data.construction.crane.pause === 60) {
    data.construction.crane.rope -= 0.3
    if (data.construction.crane.rope < 0) {
      data.construction.crane.rope = 0
    }
  } else if (data.construction.crane.shift > 0 && data.construction.crane.pause === 60) {
    data.construction.crane.shift -= 0.3
    if (data.construction.crane.shift < 0) {
      data.construction.crane.shift = 0
    }
  } else if (data.construction.crane.pause < 180) {
    data.construction.crane.pause += 1
  } else if (data.construction.crane.shift < 55 && data.construction.crane.pause === 180) {
    data.construction.crane.shift += 0.3
    if (data.construction.crane.shift > 55) {
      data.construction.crane.shift = 55
    }
  } else if (data.construction.crane.rope < 20 && data.construction.crane.pause === 180) {
    data.construction.crane.rope += 0.3
    if (data.construction.crane.rope > 20) {
      data.construction.crane.rope = 20
    }
  } else if (data.construction.crane.pause < 240) {
    data.construction.crane.pause += 1
  } else if (data.construction.crane.rope > 0 && data.construction.crane.pause === 240) {
    data.construction.crane.rope -= 0.3
    if (data.construction.crane.rope < 0) {
      data.construction.crane.rope = 0
    }
    data.construction.tree.y = data.construction.crane.rope
  } else if (data.construction.crane.shift > 0 && data.construction.crane.pause === 240) {
    data.construction.crane.shift -= 0.3
    if (data.construction.crane.shift < 0) {
      data.construction.crane.shift = 0
    }
    data.construction.tree.x = data.construction.crane.shift
  } else if (data.construction.crane.pause < 300) {
    data.construction.crane.pause += 1
    if (data.construction.crane.pause === 300) {
      data.construction.crane.pause = 0
    }
  }
}

function diagramUpdate () {
  if (data.diagram.factor < 1) {
    data.diagram.factor += 0.002
    if (data.diagram.factor > 1) {
      data.diagram.factor = 1
    }
  }
}

function entryChromeleonUpdate () {}

function p20Update () {}

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

function chromanderDraw () {
  const cD = this.$store.state.canvasDict
  const logoData = Helper.getSpriteData('story_f0_chromander', cD)
  const eyeData = Helper.getSpriteData('story_f0_chromander_eye', cD)

  Helper.drawCanvasImage(0, 0, 'story_f0_video_start_background', cD)
  Helper.drawCanvasText(
    this.canvasWidth / 2, this.canvasHeight / 2, this.$store.getters.getText('adventureStoryF0P14NowNew'),
    'storyF0P11VideoText', cD.context, data.chromander.opacity.nowNew
  )
  Helper.drawCanvasText(
    this.canvasWidth / 2, 50, this.$store.getters.getText('adventureStoryF0P14Headline'), 'storyF0P11VideoText',
    cD.context, data.chromander.opacity.headline
  )
  Helper.drawCanvasImage(
    this.canvasWidth / 2 - eyeData.spriteWidth / 2, this.canvasHeight / 2 - eyeData.spriteHeight / 2,
    'story_f0_chromander_eye', cD, 12, 0, 0, 0, data.chromander.opacity.eye
  )
  Helper.drawCanvasImage(
    this.canvasWidth / 2 - logoData.spriteWidth / 2, this.canvasHeight / 2 - logoData.spriteHeight / 2,
    'story_f0_chromander', cD, 12, 0, data.chromander.logoRotation, 0, data.chromander.opacity.logo
  )
  Helper.drawCanvasText(
    this.canvasWidth / 2, 250, this.$store.getters.getText('adventureStoryF0P14BottomText'), 'storyF0P11VideoText',
    cD.context, data.chromander.opacity.bottomText
  )
}

function chromeParkDraw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(
    150 + data.chromePark.shift, 0, 'story_f0_park_chrome', cD, 12, 0, 0, 0, data.chromePark.opacity
  )
  Helper.drawCanvasImage(150 + data.chromePark.shift, 0, 'story_f0_park', cD, 12, 0, 0, 0, 1 - data.chromePark.opacity)
  Helper.drawCanvasImage(150 - data.chromePark.shift, 0, 'story_f0_park', cD)

  if (data.chromePark.shift === 150) {
    Helper.drawCanvasLine(300, 0, 'standard', cD.context, 300, 300)
  }
}

function constructionDraw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_f0_construction_site', cD)
  Helper.drawCanvasImage(
    0 + data.construction.roller.shift, 150 + Math.sin(this.$store.state.canvasDict.frameNo) * 0.6,
    'story_f0_construction_site_roller', cD
  )
  Helper.drawCanvasLine(
    123 + data.construction.crane.shift, 40, 'thick', cD.context,
    123 + data.construction.crane.shift, 70 + data.construction.crane.rope
  )
  Helper.drawCanvasImage(0, 20, 'story_f0_construction_site_crane', cD)
  Helper.drawCanvasImage(
    100 + data.construction.tree.x, 60 + data.construction.tree.y, 'story_f0_construction_site_tree', cD
  ) // start: 100-60; end: 155-80
}

function diagramDraw () {
  const cD = this.$store.state.canvasDict

  let logo1Data = Helper.getSpriteData('story_f0_inside_explorer', cD)
  let logo2Data = Helper.getSpriteData('story_f0_chromander', cD)

  Helper.drawCanvasImage(0, 0, 'story_f0_video_start_background', cD)
  Helper.drawCanvasImage(
    150 - logo1Data.spriteWidth / 2, 60 * data.diagram.factor + 75, logo1Data.key, cD
  )
  Helper.drawCanvasRect(
    100, 180 + 60 * data.diagram.factor, 100, 60 + 60 * (1 - data.diagram.factor), 'storyF0P18InsideExplorer', cD.context
  )
  Helper.drawCanvasImage(
    450 - logo2Data.spriteWidth / 2, 195 * (1 - data.diagram.factor), logo2Data.key, cD
  )
  Helper.drawCanvasRect(
    400, 105 + 195 * (1 - data.diagram.factor), 100, 195 * data.diagram.factor, 'storyF0P18Chromander', cD.context
  )
}

function entryChromeleonDraw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_f0_entry_chromeleon', cD)
  Helper.drawCanvasTextRound(
    300, 800, 0, 755, this.$store.getters.getText('adventureStoryF0P19Sign'), 'storyF0P19Sign', cD, 1, 30
  )
}

function p20Draw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_f0_picture', cD)
}
