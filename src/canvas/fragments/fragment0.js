import * as Helper from '@/canvas/helper.js'

export const updateCalls = [
  p1Update,
  p2Update,
  p1Update,
  p4Update,
  p5Update,
  p6Update,
  p7Update,
  p8Update,
  p7Update,
  p10Update,
  p11Update,
  p12Update,
  p13Update,
  p14Update,
  p15Update,
  p16Update,
  p17Update,
  p18Update,
  p19Update,
  p20Update,
  p21Update
]

export const drawCalls = [
  p1Draw,
  p2Draw,
  p1Draw,
  p4Draw,
  p4Draw,
  p4Draw,
  p4Draw,
  p8Draw,
  p4Draw,
  p4Draw,
  p11Draw,
  p11Draw,
  p13Draw,
  p14Draw,
  p14Draw,
  p16Draw,
  p17Draw,
  p18Draw,
  p19Draw,
  p20Draw,
  p21Draw
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
      referenceY: 163,
      maxShiftY: 651
    },
    dyn: {
      stars: [],
      zoom: 0,
      shift: {
        x: 0,
        y: 0
      },
      shake: 0,
      textShift: 0,
      fade: 1,
      handShift: 0,
      pause: 0
    }
  },
  p8: {
    dyn: {
      picZoom: 0
    }
  },
  p11: {
    dyn: {
      pause: 0,
      clock: {
        multiplicator: 1,
        hour: 0,
        minute: 0,
        years: 0,
        manipulated: false
      }
    }
  },
  p13: {
    dyn: {
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
  },
  p14: {
    con: {
      opacitySpeed: 0.05
    },
    dyn: {
      pause: 0,
      opacity: {
        nowNew: 0,
        headline: 0,
        logo: 0,
        bottomText: 0,
        eye: 0
      },
      logoRotation: 0
    }
  },
  p16: {
    dyn: {
      pause: 0,
      shift: 0,
      opacity: 0
    }
  },
  p17: {
    con: {
      crane: {
        speed: 0.3
      },
      tree: {
        start: {
          x: 100,
          y: 60
        },
        end: {
          x: 155,
          y: 80
        }
      }
    },
    dyn: {
      roller: {
        startFrame: 0,
        shift: 150,
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
    }
  },
  p18: {
    con: {
      factorSpeed: 0.002
    },
    dyn: {
      factor: 0
    }
  },
  p20: {
    dyn: {
      people: [],
      newPeopleCountdown: 60
    }
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
    this.$store.getters.getText('adventureStoryF0P1Text'), 'storyF0P1Text', data.p1.con.textSize * zoom, cD.context
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
    if (data.p4.dyn.pause < 30) {
      Helper.drawCanvasSmallImage(
        halfWidth - 50 * videoZoom, halfHeight - 50 * videoZoom + data.p4.dyn.shift.y, videoZoom,
        'story_f0_video_start_button', cD
      )
    } else {
      Helper.drawCanvasLine(
        20, this.canvasHeight - 15, 'storyF0P10Bar', cD.context, data.p4.dyn.fade, this.canvasWidth - 20,
        this.canvasHeight - 15
      )
      Helper.drawCanvasCircle(
        26, this.canvasHeight - 15, 6, 'storyF0P10Handle', cD.context, data.p4.dyn.fade
      )
    }

    Helper.drawCanvasSmallImage(
      -139 + data.p4.dyn.handShift, 300 - data.p4.dyn.handShift + data.p4.dyn.shift.y, 6 - zoom * 2, 'story_f0_hand', cD
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
 * updates the size of the screen, if skipped, and the whole part 1
 */
function p5Update () {
  if (data.p4.dyn.zoom < data.p4.con.maxZoom) {
    data.p4.dyn.zoom = data.p4.con.maxZoom
  }
  p4addStars()
  p1Update.call(this, 1 - (data.p4.dyn.zoom * ((5 / 6) / 300)))
  for (let star of data.p4.dyn.stars) {
    star.x -= 0.1
  }
}

/**
 * updates shift of the screen to emulate rumble
 */
function p6Update () {
  if (data.p4.dyn.shift.y < data.p4.con.maxShiftY) {
    data.p4.dyn.shift.y += 1
    data.p4.dyn.shift.y *= 1.045
    if (data.p4.dyn.shift.y > data.p4.con.maxShiftY) {
      data.p4.dyn.shift.y = data.p4.con.maxShiftY
    }
  } else if (data.p4.dyn.shake <= 9) {
    if (data.p4.dyn.shake < 3) {
      data.p4.dyn.shift.x = 10
    } else if (data.p4.dyn.shake < 6) {
      data.p4.dyn.shift.y = data.p4.con.maxShiftY + 10
      data.p4.dyn.shift.x = 0
    } else if (data.p4.dyn.shake < 9) {
      data.p4.dyn.shift.y = data.p4.con.maxShiftY
      data.p4.dyn.shift.x = -10
    } else {
      data.p4.dyn.shift.y = data.p4.con.maxShiftY
      data.p4.dyn.shift.x = 0
    }
    data.p4.dyn.shake += 1
  } else {
    this.$store.commit('canvasDict/setStoryPart', this.$store.state.canvasDict.storyPart + 1)
  }

  p5Update.call(this)
}

/**
 * if previous scene was skipped, jumps to ceiling view
 */
function p7Update () {
  if (data.p4.dyn.shift.y !== data.p4.con.maxShiftY) {
    data.p4.dyn.shift.y = data.p4.con.maxShiftY
  }
  if (data.p4.dyn.shift.x !== 0) {
    data.p4.dyn.shift.x = 0
  }
}

/**
 * updates the zooming on the picture of the parents
 */
function p8Update () {
  data.p8.dyn.picZoom += 1
}

/**
 * draw the phone and the extra screen zoomed out
 */
function p8Draw () {
  const cD = this.$store.state.canvasDict
  let zoom = (Math.sin(data.p8.dyn.picZoom / 750) + 1) / 2

  Helper.drawCanvasSmallImage(-zoom * 40, -zoom * 20, 1 - ((1 - zoom) * (2 / 17)), 'story_f0_parents', cD)
}

/**
 * updates standing up while on bed
 */
function p10Update () {
  p4addStars()
  for (let star of data.p4.dyn.stars) {
    star.x -= data.p4.con.starSpeed
  }
  if (data.p4.dyn.shift.y > 0) {
    data.p4.dyn.shift.y -= 1
    data.p4.dyn.shift.y *= 0.98
    if (data.p4.dyn.shift.y < 0) {
      data.p4.dyn.shift.y = 0
    }
  } else if (data.p4.dyn.handShift < 167 && data.p4.dyn.zoom === 300 && data.p4.dyn.pause === 0) {
    data.p4.dyn.handShift += 4
    if (data.p4.dyn.handShift > 167) {
      data.p4.dyn.handShift = 167
    }
  } else if (data.p4.dyn.pause < 20) {
    data.p4.dyn.pause += 1
  } else if (data.p4.dyn.handShift > 60) {
    data.p4.dyn.handShift -= 4
  } else if (data.p4.dyn.zoom > 0) {
    data.p4.dyn.zoom -= 1
    data.p4.dyn.zoom = 300 - ((300 - data.p4.dyn.zoom) * 1.1)
    data.p4.dyn.handShift -= 12
    if (data.p4.dyn.zoom < 0) {
      data.p4.dyn.zoom = 0
    }
  } else if (data.p4.dyn.pause < 60) {
    data.p4.dyn.pause += 1
  } else if (data.p4.dyn.textShift < 60) {
    data.p4.dyn.textShift += 1
    data.p4.dyn.fade = Math.max((40 - data.p4.dyn.textShift) / 40, 0)
    if (data.p4.dyn.textShift === 60) {
      this.$store.commit('canvasDict/setStoryPart', this.$store.state.canvasDict.storyPart + 1)
    }
  }
}

/**
 * updates the hands of the clock
 */
function p11Update () {
  if (data.p11.dyn.pause < 30) {
    data.p11.dyn.pause += 1
  } else {
    data.p11.dyn.clock.hour = (data.p11.dyn.clock.hour - (data.p11.dyn.clock.multiplicator * 0.008)) % 360
    data.p11.dyn.clock.minute = (data.p11.dyn.clock.minute - (data.p11.dyn.clock.multiplicator * 0.1)) % 360
    if (data.p11.dyn.clock.years <= 24.5) {
      data.p11.dyn.clock.multiplicator *= 1.02
    } else if (data.p11.dyn.clock.multiplicator > 1) {
      if (!data.p11.dyn.clock.manipulated) {
        data.p11.dyn.clock.hour -= 113.5
        data.p11.dyn.clock.minute += 23.5
        data.p11.dyn.clock.manipulated = true
      }
      data.p11.dyn.clock.multiplicator /= 1.02
    } else {
      data.p11.dyn.clock.multiplicator = 0
      data.p11.dyn.clock.hour = 0
      data.p11.dyn.clock.minute = 0
      data.p11.dyn.clock.years = 50
      this.$store.commit('canvasDict/setStoryPart', this.$store.state.canvasDict.storyPart + 1)
    }
    data.p11.dyn.clock.years += data.p11.dyn.clock.multiplicator / 7000
  }
}

/**
 * draws the clock and the text above
 */
function p11Draw () {
  const cD = this.$store.state.canvasDict
  const clockData = Helper.getSpriteData('story_f0_video_clock', cD)
  let clockX = (this.canvasWidth - clockData.spriteWidth) / 2
  let clockY = (this.canvasHeight - clockData.spriteHeight) / 2 + 30

  Helper.drawCanvasImage(0, 0, 'story_f0_video_start_background', cD)
  Helper.drawCanvasImage(clockX, clockY, 'story_f0_video_clock', cD)
  Helper.drawCanvasText(
    this.canvasWidth / 2, this.canvasHeight / 2 - 15, this.$store.getters.getText('adventureStoryF0P11ClockName'),
    'storyF0P11ClockName', cD.context
  )
  Helper.drawCanvasImage(
    clockX, clockY, 'story_f0_video_clock_hour', cD, 12, 0, data.p11.dyn.clock.hour, 0
  )
  Helper.drawCanvasImage(
    clockX, clockY, 'story_f0_video_clock_minute', cD, 12, 0, data.p11.dyn.clock.minute, 0
  )
  Helper.drawCanvasImage(clockX, clockY, 'story_f0_video_clock_center', cD)

  Helper.drawCanvasRect(0, 25, this.canvasWidth, 40, 'storyF0P11Text', cD.context)
  Helper.drawCanvasRectBorder(-5, 25, this.canvasWidth + 10, 40, 'storyF0P11Text', cD.context)

  if (data.p11.dyn.clock.years > 0.5) {
    Helper.drawCanvasText(
      this.canvasWidth / 2, 40,
      this.$store.getters.getText('adventureStoryF0P11Before', Math.floor(data.p11.dyn.clock.years)),
      'storyF0P11VideoText', cD.context
    )
  } else {
    Helper.drawCanvasText(
      this.canvasWidth / 2, 40, this.$store.getters.getText('adventureStoryF0P11Today'), 'storyF0P11VideoText',
      cD.context
    )
  }
}

/**
 * if before part was skipped, sets values
 */
function p12Update () {
  if (data.p11.dyn.clock.years !== 50) {
    data.p11.dyn.clock.hour = 0
    data.p11.dyn.clock.minute = 0
    data.p11.dyn.clock.second = 0
    data.p11.dyn.clock.years = 50
    data.p11.dyn.pause = 30
  }
}

/**
 * updates position of cars and spawns new ones
 */
function p13Update () {
  for (let car of data.p13.dyn.cars) {
    if (car.directionUp) {
      car.x += 4
      car.y -= 1
    } else {
      car.x -= 4
      car.y += 1
    }
  }

  data.p13.dyn.cars = data.p13.dyn.cars.filter(car =>
    (car.directionUp && car.x < this.canvasWidth) || (!car.directionUp && car.y < this.canvasHeight)
  )

  data.p13.dyn.newCarCountdown -= 1

  if (data.p13.dyn.newCarCountdown <= 0) {
    if (Math.random() < 0.5) {
      const spriteKeys = ['story_f0_woogle_truck']

      let spriteData = Helper.getSpriteData(
        spriteKeys[Math.floor(spriteKeys.length * Math.random())], this.$store.state.canvasDict
      )
      data.p13.dyn.cars.push({
        x: 180 - spriteData.spriteWidth,
        y: 300,
        spriteKey: spriteData.key,
        directionUp: true
      })
    } else {
      const spriteKeys = ['story_f0_woogle_car']

      data.p13.dyn.cars.unshift({
        x: 600,
        y: 170,
        spriteKey: spriteKeys[Math.floor(spriteKeys.length * Math.random())],
        directionUp: false
      })
    }
    data.p13.dyn.newCarCountdown = Math.floor(60 * Math.random()) + 40
  }
}

/**
 * draw the woogle headquarters and driving cars
 */
function p13Draw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_f0_woogle', cD)

  for (let car of data.p13.dyn.cars) {
    Helper.drawCanvasImage(car.x, car.y, car.spriteKey, cD)
  }
}

/**
 * updates woogle chromander ad with opacity etc
 */
function p14Update () {
  if (data.p14.dyn.pause < 30) {
    data.p14.dyn.pause += 1
  } else if (data.p14.dyn.opacity.nowNew < 1 && data.p14.dyn.pause === 30) {
    data.p14.dyn.opacity.nowNew += data.p14.con.opacitySpeed
  } else if (data.p14.dyn.pause < 90) {
    data.p14.dyn.pause += 1
  } else if (data.p14.dyn.opacity.nowNew > 0 && data.p14.dyn.pause === 90) {
    data.p14.dyn.opacity.nowNew -= data.p14.con.opacitySpeed
  } else if (data.p14.dyn.opacity.headline < 1) {
    data.p14.dyn.opacity.headline += data.p14.con.opacitySpeed
  } else if (data.p14.dyn.pause < 120) {
    data.p14.dyn.pause += 1
  } else if (data.p14.dyn.opacity.logo < 1) {
    data.p14.dyn.opacity.logo += data.p14.con.opacitySpeed
    if (data.p14.dyn.opacity.logo > 1) {
      data.p14.dyn.opacity.logo = 1
    }
  } else if (data.p14.dyn.pause < 150) {
    data.p14.dyn.pause += 1
  } else if (data.p14.dyn.opacity.bottomText < 1) {
    data.p14.dyn.opacity.bottomText += data.p14.con.opacitySpeed
  } else if (data.p14.dyn.pause < 300) {
    data.p14.dyn.pause += 1
  } else if (data.p14.dyn.opacity.eye < 1) {
    data.p14.dyn.opacity.eye += 0.005
    if (data.p14.dyn.opacity.eye > 1) {
      data.p14.dyn.opacity.eye = 1
    }
  } else {
    this.$store.commit('canvasDict/setStoryPart', this.$store.state.canvasDict.storyPart + 1)
  }

  if (data.p14.dyn.opacity.logo > 0) {
    data.p14.dyn.logoRotation += 1
    data.p14.dyn.logoRotation %= 360
  }
}

/**
 * shows the ad of woogle chromander
 */
function p14Draw () {
  const cD = this.$store.state.canvasDict
  const logoData = Helper.getSpriteData('story_f0_chromander', cD)
  const eyeData = Helper.getSpriteData('story_f0_chromander_eye', cD)

  Helper.drawCanvasImage(0, 0, 'story_f0_video_start_background', cD)
  Helper.drawCanvasText(
    this.canvasWidth / 2, this.canvasHeight / 2, this.$store.getters.getText('adventureStoryF0P14NowNew'),
    'storyF0P11VideoText', cD.context, data.p14.dyn.opacity.nowNew
  )
  Helper.drawCanvasText(
    this.canvasWidth / 2, 50, this.$store.getters.getText('adventureStoryF0P14Headline'), 'storyF0P11VideoText',
    cD.context, data.p14.dyn.opacity.headline
  )
  Helper.drawCanvasImage(
    this.canvasWidth / 2 - eyeData.spriteWidth / 2, this.canvasHeight / 2 - eyeData.spriteHeight / 2,
    'story_f0_chromander_eye', cD, 12, 0, 0, 0, data.p14.dyn.opacity.eye
  )
  Helper.drawCanvasImage(
    this.canvasWidth / 2 - logoData.spriteWidth / 2, this.canvasHeight / 2 - logoData.spriteHeight / 2,
    'story_f0_chromander', cD, 12, 0, data.p14.dyn.logoRotation, 0, data.p14.dyn.opacity.logo
  )
  Helper.drawCanvasText(
    this.canvasWidth / 2, 250, this.$store.getters.getText('adventureStoryF0P14BottomText'), 'storyF0P11VideoText',
    cD.context, data.p14.dyn.opacity.bottomText
  )
}

/**
 * sets the opacity values of the chromander ad if skipped
 */
function p15Update () {
  if (data.p14.dyn.opacity.nowNew > 0) {
    data.p14.dyn.opacity.nowNew = 0
  }
  if (data.p14.dyn.opacity.headline < 1) {
    data.p14.dyn.opacity.headline = 1
  }
  if (data.p14.dyn.opacity.logo < 1) {
    data.p14.dyn.opacity.logo = 1
  }
  if (data.p14.dyn.opacity.bottomText < 1) {
    data.p14.dyn.opacity.bottomText = 1
  }
  if (data.p14.dyn.opacity.eye < 1) {
    data.p14.dyn.opacity.eye = 1
  }

  if (data.p14.dyn.opacity.logo > 0) {
    data.p14.dyn.logoRotation += 1
    data.p14.dyn.logoRotation %= 360
  }
}

/**
 * splits park in two and fade one out
 */
function p16Update () {
  if (data.p16.dyn.pause < 60) {
    data.p16.dyn.pause += 1
  } else if (data.p16.dyn.shift < 150) {
    data.p16.dyn.shift += 2
  } else if (data.p16.dyn.opacity < 1) {
    data.p16.dyn.opacity += 0.01
    if (data.p16.dyn.opacity > 1) {
      data.p16.dyn.opacity = 1
    }
  }
}

/**
 * draws two parks, one will be faded out and a grey one
 */
function p16Draw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(
    150 + data.p16.dyn.shift, 0, 'story_f0_park_chrome', cD, 12, 0, 0, 0, data.p16.dyn.opacity
  )
  Helper.drawCanvasImage(150 + data.p16.dyn.shift, 0, 'story_f0_park', cD, 12, 0, 0, 0, 1 - data.p16.dyn.opacity)
  Helper.drawCanvasImage(150 - data.p16.dyn.shift, 0, 'story_f0_park', cD)

  if (data.p16.dyn.shift === 150) {
    Helper.drawCanvasLine(300, 0, 'standard', cD.context, 1, 300, 300)
  }
}

/**
 * updates the crane and the roller on the construction site
 */
function p17Update () {
  let frames = this.$store.state.canvasDict.frameNo - data.p17.dyn.roller.startFrame
  let xDist = data.p17.con.tree.end.x - data.p17.con.tree.start.x
  let yDist = data.p17.con.tree.end.y - data.p17.con.tree.start.y

  if (frames / 200 < Math.PI * 2) {
    data.p17.dyn.roller.shift = Math.cos(frames / 200) * 150
  } else if (data.p17.dyn.roller.pause < 240) {
    data.p17.dyn.roller.pause += 1
  } else {
    data.p17.dyn.roller.pause = 0
    data.p17.dyn.roller.startFrame = this.$store.state.canvasDict.frameNo
  }

  if (data.p17.dyn.crane.shift < xDist && data.p17.dyn.crane.pause === 0) {
    data.p17.dyn.crane.shift += data.p17.con.crane.speed
    if (data.p17.dyn.crane.shift > xDist) {
      data.p17.dyn.crane.shift = xDist
    }
    data.p17.dyn.tree.x = data.p17.dyn.crane.shift
  } else if (data.p17.dyn.crane.rope < yDist && data.p17.dyn.crane.pause === 0) {
    data.p17.dyn.crane.rope += data.p17.con.crane.speed
    if (data.p17.dyn.crane.rope > yDist) {
      data.p17.dyn.crane.rope = yDist
    }
    data.p17.dyn.tree.y = data.p17.dyn.crane.rope
  } else if (data.p17.dyn.crane.pause < 60) {
    data.p17.dyn.crane.pause += 1
  } else if (data.p17.dyn.crane.rope > 0 && data.p17.dyn.crane.pause === 60) {
    data.p17.dyn.crane.rope -= data.p17.con.crane.speed
    if (data.p17.dyn.crane.rope < 0) {
      data.p17.dyn.crane.rope = 0
    }
  } else if (data.p17.dyn.crane.shift > 0 && data.p17.dyn.crane.pause === 60) {
    data.p17.dyn.crane.shift -= data.p17.con.crane.speed
    if (data.p17.dyn.crane.shift < 0) {
      data.p17.dyn.crane.shift = 0
    }
  } else if (data.p17.dyn.crane.pause < 180) {
    data.p17.dyn.crane.pause += 1
  } else if (data.p17.dyn.crane.shift < xDist && data.p17.dyn.crane.pause === 180) {
    data.p17.dyn.crane.shift += data.p17.con.crane.speed
    if (data.p17.dyn.crane.shift > xDist) {
      data.p17.dyn.crane.shift = xDist
    }
  } else if (data.p17.dyn.crane.rope < yDist && data.p17.dyn.crane.pause === 180) {
    data.p17.dyn.crane.rope += data.p17.con.crane.speed
    if (data.p17.dyn.crane.rope > yDist) {
      data.p17.dyn.crane.rope = yDist
    }
  } else if (data.p17.dyn.crane.pause < 240) {
    data.p17.dyn.crane.pause += 1
  } else if (data.p17.dyn.crane.rope > 0 && data.p17.dyn.crane.pause === 240) {
    data.p17.dyn.crane.rope -= data.p17.con.crane.speed
    if (data.p17.dyn.crane.rope < 0) {
      data.p17.dyn.crane.rope = 0
    }
    data.p17.dyn.tree.y = data.p17.dyn.crane.rope
  } else if (data.p17.dyn.crane.shift > 0 && data.p17.dyn.crane.pause === 240) {
    data.p17.dyn.crane.shift -= data.p17.con.crane.speed
    if (data.p17.dyn.crane.shift < 0) {
      data.p17.dyn.crane.shift = 0
    }
    data.p17.dyn.tree.x = data.p17.dyn.crane.shift
  } else if (data.p17.dyn.crane.pause < 300) {
    data.p17.dyn.crane.pause += 1
    if (data.p17.dyn.crane.pause === 300) {
      data.p17.dyn.crane.pause = 0
    }
  }
}

/**
 * draws the construction site with a crane, a tree and a roller
 */
function p17Draw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_f0_construction_site', cD)
  Helper.drawCanvasImage(
    0 + data.p17.dyn.roller.shift, 150 + Math.sin(this.$store.state.canvasDict.frameNo) * 0.6,
    'story_f0_construction_site_roller', cD
  )
  Helper.drawCanvasLine(
    123 + data.p17.dyn.crane.shift, 40, 'thick', cD.context, 1,
    123 + data.p17.dyn.crane.shift, 70 + data.p17.dyn.crane.rope
  )
  Helper.drawCanvasImage(0, 20, 'story_f0_construction_site_crane', cD)
  Helper.drawCanvasImage(
    100 + data.p17.dyn.tree.x, 60 + data.p17.dyn.tree.y, 'story_f0_construction_site_tree', cD
  )
}

/**
 * updates the size of the diagram bars
 */
function p18Update () {
  if (data.p18.dyn.factor < 1) {
    data.p18.dyn.factor += data.p18.con.factorSpeed
    if (data.p18.dyn.factor > 1) {
      data.p18.dyn.factor = 1
    }
  }
}

/**
 * draws the diagram of the difference between inside explorer and woogle chromander
 */
function p18Draw () {
  const cD = this.$store.state.canvasDict

  let logo1Data = Helper.getSpriteData('story_f0_inside_explorer', cD)
  let logo2Data = Helper.getSpriteData('story_f0_chromander', cD)

  Helper.drawCanvasImage(0, 0, 'story_f0_video_start_background', cD)
  Helper.drawCanvasImage(
    150 - logo1Data.spriteWidth / 2, 60 * data.p18.dyn.factor + 75, logo1Data.key, cD
  )
  Helper.drawCanvasRect(
    100, 180 + 60 * data.p18.dyn.factor, 100, 60 + 60 * (1 - data.p18.dyn.factor), 'storyF0P18InsideExplorer', cD.context
  )
  Helper.drawCanvasImage(
    450 - logo2Data.spriteWidth / 2, 195 * (1 - data.p18.dyn.factor), logo2Data.key, cD
  )
  Helper.drawCanvasRect(
    400, 105 + 195 * (1 - data.p18.dyn.factor), 100, 195 * data.p18.dyn.factor, 'storyF0P18Chromander', cD.context
  )
}

/**
 * updates nothing
 */
function p19Update () {}

/**
 * draws chromeleon at the entrance of the chrome park
 */
function p19Draw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_f0_entry_chromeleon', cD)
  Helper.drawCanvasTextRound(
    300, 800, 0, 755, this.$store.getters.getText('adventureStoryF0P19Sign'), 'storyF0P19Sign', cD, 1, 30
  )
}

/**
 * adds people that look at the picture and moves them
 */
function p20Update () {
  if (data.p20.dyn.newPeopleCountdown > 0) {
    data.p20.dyn.newPeopleCountdown -= 1
  } else {
    var ltr = Math.random() > 0.5
    data.p20.dyn.people.push({
      spriteKey: 'story_f0_weird_pic_man',
      ltr: ltr,
      x: ltr ? -100 : 610,
      y: Math.floor(Math.random() * 20) + 280,
      speed: (Math.random() * 3) + 1
    })
    data.p20.dyn.people.sort((a, b) => {
      if (a.y < b.y) {
        return -1
      } else if (a.y > b.y) {
        return 1
      }
      return 0
    })
    data.p20.dyn.newPeopleCountdown = Math.floor(180 * Math.random()) + 60
  }

  let deletePeople = []
  for (let p of data.p20.dyn.people) {
    if (p.ltr) {
      p.x += p.speed
      if (p.x > this.canvasWidth + 10) {
        deletePeople.push(p)
      }
    } else {
      p.x -= p.speed
      if (p.x < -100) {
        deletePeople.push(p)
      }
    }
  }

  data.p20.dyn.people = data.p20.dyn.people.filter(people => !deletePeople.includes(people))
}

/**
 * draws the strange picture that chromeleon drew
 */
function p20Draw () {
  const cD = this.$store.state.canvasDict
  const spriteData = Helper.getSpriteData('story_f0_weird_pic_man', cD)

  Helper.drawCanvasImage(0, 0, 'story_f0_picture', cD)

  for (let p of data.p20.dyn.people) {
    Helper.drawCanvasImage(p.x, p.y - spriteData.spriteHeight, spriteData.key, cD)
  }
}

/**
 *
 */
function p21Update () {

}

/**
 * draws the villa with chromeleon and the rich guy
 */
function p21Draw () {
  const cD = this.$store.state.canvasDict

  Helper.drawCanvasImage(0, 0, 'story_f0_house_of_rich', cD)
}
