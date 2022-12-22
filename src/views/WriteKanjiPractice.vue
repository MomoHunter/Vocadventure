<template>
  <div class="page">
    <TheHero title="writeKanjiPracticeTitle" :subtitle="[currentLetter]" />
    <div class="flex-column margin-top-mini margin-bottom-mini margin-left-mini">
      <TheTag class="margin-bottom-mini" title="writeKanjiCategoryTag"
              :text="appConst.getCategoryName(currentWord.categoryKey)" color="info-2" />
      <TheTag title="writeKanjiDifficultyTag" :text="'difficulty' + currentWord.difficulty" color="info-2" />
    </div>
    <div class="flex-column flex-grow flex-center"
         @mousedown="startDraw($event, 'mouse')" @mouseup="endDraw($event, 'mouse')"
         @touchstart="startDraw($event, 'touch')" @touchend="endDraw($event, 'touch')">
      <div v-square class="write-kanji width-full height-full">
        <div class="numbers">
          <div class="entry">
            <div class="title">
              {{ getText('writeKanjiPracticeDrawAmount') }}
            </div>
            <div class="amount">
              {{ drawAmount }} / 6
            </div>
          </div>
          <div class="entry">
            <div class="title">
              {{ getText('writeKanjiPracticeStrokeNumber') }}
            </div>
            <div class="amount">
              {{ canvasSettings.strokeCount }} / {{ kanaSvgPaths.length }}
            </div>
          </div>
        </div>
        <div class="draw-area">
          <div class="background">
            <div class="top left has-alpha"></div>
            <div class="top right has-alpha"></div>
            <div class="bottom left has-alpha"></div>
            <div class="bottom right has-alpha"></div>
          </div>
          <svg v-fullsize id="kanaSvg2" class="svg"></svg>
          <canvas v-fullsize ref="kanaCanvas" class="canvas" @mousemove="drawLine($event, 'mouse')"
                  @touchmove="drawLine($event, 'touch')"></canvas>
        </div>
        <div class="info">

        </div>
      </div>
      <!-- <transition enter-active-class="animate__animated slide-in-left-custom duration-c-350ms"
                  leave-active-class="animate__animated slide-out-left-custom duration-c-350ms"
                  @after-leave="showNumber()" @after-enter="startAnimation()">
        <div v-show="canvasVisible" v-square class="special-font width-fifth-four height-fifth-four animate__animated duration-c-800ms"
            :class="[getSizeClass('general'), { 'animate__shakeX': canvasSettings.wrongStrokeActive }]">
          <div class="count">
            {{ canvasSettings.strokeCount }} / {{ kanaSvgPaths.length }}
          </div>
          <div class="background">
            <div class="top left has-alpha"></div>
            <div class="top right has-alpha"></div>
            <div class="bottom left has-alpha"></div>
            <div class="bottom right has-alpha"></div>
          </div>
          <svg v-fullsize id="kanaSvg2" class="text-gold svg"></svg>
          <canvas v-fullsize ref="kanaCanvas" class="canvas" @mousemove="drawLine($event, 'mouse')"
                  @touchmove="drawLine($event, 'touch')"></canvas>
        </div>
      </transition>
      <transition enter-active-class="animate__animated animate__backInUp duration-c-350ms"
                  leave-active-class="animate__animated animate__backOutDown duration-c-350ms"
                  @after-enter="increaseNumber()" @after-leave="showCanvas()">
        <div v-show="numberVisible" class="flex-column flex-grow flex-center"
            :class="{ 'animate__animated animate__pulse duration-c-300ms': highlightNumber }">
          <span class="kanji-training-number" :class="getSizeClass('general')">
            {{ drawAmount }} / 6
          </span>
        </div>
      </transition> -->
    </div>
    <div class="button-container">
      <ButtonBasic class="width-full" icon="arrow-left" color="red" text="writeKanjiPracticeButton1" @click="navTo()" />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import TheTag from '@/components/TheTag.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppDynStore } from '@/stores/appdyn'
import { useAppConstStore } from '@/stores/appconst'

import * as Helper from '@/canvas/helper.js'
import Kana from '@/data/special/kana.json'

const router = useRouter()
const savestate = useSavestateStore()
const appConst = useAppConstStore()
const appDyn = useAppDynStore()

onBeforeMount(() => {
  if (appDyn.categoriesChosen.length === 0) {
    navTo('error')
  } else {
    const computedStyle = getComputedStyle(document.body)
    const color = computedStyle.color.replaceAll(/(.*\(|\)| )/g, '').split(',')
    const backgroundColor = computedStyle.backgroundColor.replaceAll(/(.*\(|\)| )/g, '').split(',')
    const shadowColor = [
      parseInt(color[0]) + (parseInt(backgroundColor[0]) - parseInt(color[0])) * 0.5,
      parseInt(color[1]) + (parseInt(backgroundColor[1]) - parseInt(color[1])) * 0.5,
      parseInt(color[2]) + (parseInt(backgroundColor[2]) - parseInt(color[2])) * 0.5
    ]
    canvasSettings.color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    canvasSettings.shadowColor = `rgb(${shadowColor[0]}, ${shadowColor[1]}, ${shadowColor[2]})`
    getSvgPaths()
  }
})

onMounted(() => {
  if (kanaCanvas.value) {
    canvasSettings.context = kanaCanvas.value.getContext('2d')
    canvasSettings.width = Math.floor(kanaCanvas.value.getAttribute('width') / 36)
    canvasSettings.scaleFactor = kanaCanvas.value.getAttribute('width') / 109
    canvasSettings.scaleMatrix = Snap.matrix().scale(canvasSettings.scaleFactor)
  }
  kanaSnap.value = new Snap('#kanaSvg2')
  if (kanaSvgPaths.value.length > 0) {
    startAnimation()
  }
})

const words = computed(() => {
  if (appDyn.writeKanji.selectedTab === 0) {
    let newVocabs = appConst.getFullVocabs(false)
    let newWordsObj = {}
    for (let word of newVocabs.words) {
      if (!Object.hasOwn(newWordsObj, word.categoryKey)) {
        newWordsObj[word.categoryKey] = []
      }
      newWordsObj[word.categoryKey].push(word)
    }
    newVocabs.words = newWordsObj
    return newVocabs
  } else {
    let newWordsObj = {}
    for (let category of Kana.categories) {
      let categoryName = `[${Kana.tag}] ${category[savestate.app.lang]}`
      newWordsObj[categoryName] = []
      for (let i = 0; i < category.words.length; i++) {
        let wordObj = JSON.parse(JSON.stringify(category.words[i]))
        wordObj.categoryKey = categoryName
        wordObj.index = i
        newWordsObj[categoryName].push(wordObj)
      }
    }
    return {
      words: newWordsObj,
      mainAlphabet: savestate.app.lang,
      latinAlphabet: 'kana',
      foreignAlphabet: 'kana'
    }
  }
})

const currentWord = computed(() => {
  let selected = appDyn.writeKanji.selectedWord[appDyn.writeKanji.selectedTab]
  if (appDyn.categoriesChosen.length > 0) {
    return words.value.words[selected.categoryKey][selected.index]
  }
  return {}
})

const currentLetter = computed(() => {
  if (currentWord.value && Object.hasOwn(currentWord.value, words.value.foreignAlphabet)) {
    return currentWord.value[words.value.foreignAlphabet][
      appDyn.writeKanji.selectedLetter[appDyn.writeKanji.selectedTab]
    ]
  }
  return ''
})

const kanaSnap = ref(null)
const kanaSvgPaths = ref([])
const kanaCodePoint = ref('')

function getSvgPaths () {
  const currentLetter = currentWord.value[words.value.foreignAlphabet][
    appDyn.writeKanji.selectedLetter[appDyn.writeKanji.selectedTab]
  ]
  let codePoint = currentLetter.codePointAt(0).toString(16)
  while (codePoint.length < 5) {
    codePoint = '0' + codePoint
  }
  kanaCodePoint.value = codePoint
  kanaSvgPaths.value = appConst.kanaSvg.selectAll(`path[id*="${codePoint}-s"]`)
}

const animationData = reactive({
  running: false,
  lag: -500,
  startTS: 0,
  refreshrate: 1000 / 60,
  frameNo: 0,
  currentStroke: 0,
  currentStrokeLength: 0,
  reset: () => {
    animationData.running = false
    animationData.lag = 0
    animationData.startTS = 0
    animationData.frameNo = 0
    animationData.currentStroke = 0
    animationData.currentStrokeLength = 0
  }
})

function startAnimation () {
  animationData.running = true
  animationLoop()
}

function animationLoop (timestamp = 0) {
  if (!animationData.running) {
    return
  }

  requestAnimationFrame((newTS) => animationLoop(newTS))
  const timeDiff = timestamp - animationData.startTS
  if (timeDiff > 0 && animationData.startTS > 0) {
    animationData.lag += timeDiff
  }

  while (animationData.lag > animationData.refreshrate) {
    animationData.frameNo += 1

    animationUpdate()

    if (animationData.lag > animationData.refreshrate * 5) {
      animationData.lag %= animationData.refreshrate
    } else {
      animationData.lag -= animationData.refreshrate
    }
  }

  kanaSnap.value.clear()
  animationDraw()

  animationData.startTS = timestamp
}

function animationUpdate () {
  let animSpeed = (savestate.app.writeKanjiAnimationSpeed / 10)
  // only forEach possible, cause Snap Framework is weird or I didn't get it
  kanaSvgPaths.value.forEach((path, index) => {
    if (index === animationData.currentStroke) {
      let negPercentage = 1 - (animationData.currentStrokeLength / path.getTotalLength())
      animationData.currentStrokeLength += Math.min(
        animSpeed,
        animSpeed * Math.pow((negPercentage + 0.5), 2)
      )
      if (path.getTotalLength() <= animationData.currentStrokeLength) {
        addSvgLine(path, animationData.currentStroke)
        animationData.currentStrokeLength = 0
        animationData.currentStroke += 1
        animationData.running = false
      }
      return false // to stop the forEach
    }
  })
}

function animationDraw () {
  kanaSvgPaths.value.forEach((path, index) => {
    if (index < animationData.currentStroke) {
      let newPath = path.clone()
      newPath.transform(canvasSettings.scaleMatrix.toTransformString())
      newPath.attr({
        fill: 'transparent',
        stroke: canvasSettings.shadowColor,
        strokeWidth: 3,
        strokeLinecap: 'round'
      })
      kanaSnap.value.append(newPath)
    } else if (index === animationData.currentStroke && animationData.running) {
      if (animationData.currentStrokeLength > 0) {
        let newPath = kanaSnap.value.path(Snap.path.getSubpath(path, 0, animationData.currentStrokeLength))
        newPath.transform(canvasSettings.scaleMatrix.toTransformString())
        newPath.attr({
          fill: 'transparent',
          stroke: 'rgba(187, 34, 34)',
          strokeWidth: 3,
          strokeLinecap: 'round'
        })
        kanaSnap.value.append(newPath)
      }
      return false // to stop the forEach
    }
  })
}

function addSvgLine (path, pathIndex) {
  if (pathIndex === canvasSettings.svgLines.length) {
    canvasSettings.svgLines.push([])
  } else if (pathIndex < canvasSettings.svgLines.length) {
    canvasSettings.svgLines[pathIndex] = []
  }
  for (let len = 0; len <= path.getTotalLength(); len += 2) {
    canvasSettings.svgLines[pathIndex].push(path.getPointAtLength(len))
  }
  const lastPathPoint = path.getPointAtLength(path.getTotalLength())
  const lastArrayPoint = canvasSettings.svgLines[pathIndex][canvasSettings.svgLines[pathIndex].length - 1]
  if (lastPathPoint.x !== lastArrayPoint.x || lastPathPoint.y !== lastArrayPoint.y) {
    canvasSettings.svgLines[pathIndex].push(lastPathPoint)
  }
}

const canvasSettings = reactive({
  context: null,
  color: 'rgb(0, 0, 0)',
  shadowColor: 'rgb(0, 0, 0)',
  width: 1,
  scaleFactor: 1,
  scaleMatrix: null,
  isDrawing: false,
  touchIdentifier: null,
  lastPoint: null,
  invalidTouch: false,
  strokeCount: 1,
  lines: [],
  svgLines: [],
  wrongStrokeActive: false,
  reset: () => {
    canvasSettings.strokeCount = 1
    canvasSettings.lines = []
  }
})
const kanaCanvas = ref(null)

function startDraw (event, type) {
  if (animationData.running) {
    canvasSettings.invalidTouch = true
    return
  }

  canvasSettings.isDrawing = true
  let clientRect = kanaCanvas.value.getBoundingClientRect()
  switch (type) {
    case 'touch':
      for (let touch of event.changedTouches) {
        if (canvasSettings.touchIdentifier === null) {
          canvasSettings.touchIdentifier = touch.identifier
        }
        if (canvasSettings.touchIdentifier === touch.identifier) {
          canvasSettings.lastPoint = {
            x: touch.pageX - clientRect.left,
            y: touch.pageY - clientRect.top
          }
        }
      }
      break
    case 'mouse':
      canvasSettings.lastPoint = {
        x: event.pageX - clientRect.left,
        y: event.pageY - clientRect.top
      }
      break
    default:
      canvasSettings.lastPoint = {
        x: 0,
        y: 0
      }
  }

  if (canvasSettings.lastPoint.x < 0 || canvasSettings.lastPoint.x > clientRect.width ||
      canvasSettings.lastPoint.y < 0 || canvasSettings.lastPoint.y > clientRect.height) {
    endDraw(event, type)
  } else {
    canvasSettings.lines.push([{
      x: canvasSettings.lastPoint.x,
      y: canvasSettings.lastPoint.y
    }])
  }
}

function drawLine (event, type) {
  if (!canvasSettings.isDrawing) {
    return
  }
  
  let pos = { x: 0, y: 0 }
  let clientRect = kanaCanvas.value.getBoundingClientRect()
  switch (type) {
    case 'touch':
      for (let touch of event.changedTouches) {
        if (canvasSettings.touchIdentifier === touch.identifier) {
          pos = {
            x: touch.pageX - clientRect.left,
            y: touch.pageY - clientRect.top
          }
        }
      }
      break
    case 'mouse':
      pos = {
        x: event.pageX - clientRect.left,
        y: event.pageY - clientRect.top
      }
      break
    default:
      pos = { x: 0, y: 0 }
  }
  Helper.drawCanvasLineCustom(
    canvasSettings.lastPoint.x, canvasSettings.lastPoint.y, canvasSettings.color, canvasSettings.width, 'round',
    [], canvasSettings.context, pos.x, pos.y
  )
  canvasSettings.lastPoint = pos
  canvasSettings.lines[canvasSettings.lines.length - 1].push({
    x: canvasSettings.lastPoint.x,
    y: canvasSettings.lastPoint.y
  })
}

function endDraw (event, type) {
  if (canvasSettings.invalidTouch) {
    canvasSettings.invalidTouch = false
    return
  }

  canvasSettings.isDrawing = false
  canvasSettings.lastPoint = null
  canvasSettings.touchIdentifier = null

  const strokeIndex = animationData.currentStroke - 1

  canvasSettings.lines[strokeIndex] = canvasSettings.lines[strokeIndex].filter(
    (_, index, line) => index % 8 === 0 || index === line.length - 1
  )

  const svgStrokeLength = getLineLength('svg', strokeIndex)
  const drawStrokeLength = getLineLength('draw', strokeIndex)

  if (Math.abs((drawStrokeLength / canvasSettings.scaleFactor) - svgStrokeLength) > svgStrokeLength * 0.2) {
    resetLastLine(
      'length is too far apart',
      Math.abs((drawStrokeLength / canvasSettings.scaleFactor) - svgStrokeLength),
      svgStrokeLength * 0.2
    )
    return
  }

  let controlPoints = []
  let strokeLength = 0
  let pointIndex = 0
  let accDist = 0
  let strokeCopy = kanaSvgPaths.value[strokeIndex].clone()
  for (let len = 0; len <= drawStrokeLength; len += 4 * canvasSettings.scaleFactor) {
    let newPoint = null
    while (strokeLength < len && pointIndex < canvasSettings.lines[strokeIndex].length - 1) {
      pointIndex += 1
      const prevPoint = canvasSettings.lines[strokeIndex][pointIndex - 1]
      const point = canvasSettings.lines[strokeIndex][pointIndex]
      strokeLength += getDist(prevPoint, point)
    }
    if (strokeLength === len) {
      newPoint = {
        x: canvasSettings.lines[strokeIndex][pointIndex].x,
        y: canvasSettings.lines[strokeIndex][pointIndex].y
      }
    } else if (strokeLength < len) {
      continue
    } else {
      const prevPoint = canvasSettings.lines[strokeIndex][pointIndex - 1]
      const point = canvasSettings.lines[strokeIndex][pointIndex]
      const dist = getDist(prevPoint, point)
      const xDist = prevPoint.x - point.x
      const yDist = prevPoint.y - point.y
      const percentage = (strokeLength - len) / dist
      newPoint = {
        x: point.x + xDist * percentage,
        y: point.y + yDist * percentage
      }
    }

    newPoint.x /= canvasSettings.scaleFactor
    newPoint.y /= canvasSettings.scaleFactor

    Helper.drawCanvasCircleCustom(
      newPoint.x * canvasSettings.scaleFactor, newPoint.y * canvasSettings.scaleFactor, 3, '0, 255, 0',
      canvasSettings.context
    )

    const closestPoint = Snap.closestPoint(
      strokeCopy,
      newPoint.x,
      newPoint.y
    )
    if (closestPoint.distance > 7) {
      resetLastLine(
        'point too far away from line',
        closestPoint.distance,
        7
      )
      return
    }
    controlPoints.push({
      x: closestPoint.x,
      y: closestPoint.y,
      dist: closestPoint.distance,
      posOnLine: closestPoint.length,
      refX: newPoint.x,
      refY: newPoint.y
    })
    accDist += closestPoint.distance
  }

  for (let i = 0; i < controlPoints.length; i++) {
    Helper.drawCanvasCircleCustom(
      controlPoints[i].x * canvasSettings.scaleFactor, controlPoints[i].y * canvasSettings.scaleFactor, 3, '255, 0, 0',
      canvasSettings.context
    )
    Helper.drawCanvasCircleCustom(
      controlPoints[i].refX * canvasSettings.scaleFactor, controlPoints[i].refY * canvasSettings.scaleFactor, 3, '255, 0, 0',
      canvasSettings.context
    )
    Helper.drawCanvasLineCustom(
      controlPoints[i].x * canvasSettings.scaleFactor, controlPoints[i].y * canvasSettings.scaleFactor, 'rgb(255, 255, 0)',
      2, 'round', [], canvasSettings.context, controlPoints[i].refX * canvasSettings.scaleFactor, controlPoints[i].refY * canvasSettings.scaleFactor
    )
  }

  if (accDist > controlPoints.length * 3) {
    resetLastLine(
      'accumulated distance is too far away',
      accDist,
      controlPoints.length * 3
    )
    return
  }

  const avgDist = accDist / controlPoints.length
  for (let i = 0; i < controlPoints.length; i++) {
    if (Math.abs(controlPoints[i].dist - avgDist) > 5) {
      resetLastLine(
        'too far away from the average distance',
        Math.abs(controlPoints[i].dist - avgDist),
        5
      )
      return
    }
  }

  let evenOrLower = 0
  const limit = Math.max(Math.ceil(controlPoints.length * 0.1), 2)
  for (let i = 0; i < controlPoints.length - 1; i++) {
    if (controlPoints[i].posOnLine >= controlPoints[i + 1].posOnLine) {
      evenOrLower += 1
    } else if (controlPoints[i].posOnLine < controlPoints[i + 1].posOnLine) {
      evenOrLower = 0
    }

    if (evenOrLower > limit) {
      resetLastLine(
        'too long in the wrong direction',
        limit
      )
      return
    }
  }

  if (animationData.currentStroke < kanaSvgPaths.value.length) {
    canvasSettings.strokeCount += 1
    startAnimation()
  } else {
    hideCanvas()
  }
}

function resetLastLine (...reason) {
  canvasSettings.lines = canvasSettings.lines.slice(0, animationData.currentStroke - 1)
  redrawCanvas()
  wrongStrokeAnimation()
  console.log(...reason)
}

function redrawCanvas () {
  canvasSettings.context.clearRect(0, 0, kanaCanvas.value.width, kanaCanvas.value.height)
  for (const line of canvasSettings.lines) {
    const startPoint = line[0]
    let lineTail = line.slice(1).map(point => [point.x, point.y])
    Helper.drawCanvasLineCustom(
      startPoint.x, startPoint.y, canvasSettings.color, canvasSettings.width, 'round', [],
      canvasSettings.context, ...lineTail.flat()
    )
  }
}

function wrongStrokeAnimation () {
  canvasSettings.wrongStrokeActive = true
  setTimeout(() => {
    canvasSettings.wrongStrokeActive = false
  }, 1000)
}

function getLineLength (type, strokeIndex) {
  let points = []
  if (type === 'svg') {
    points = canvasSettings.svgLines[strokeIndex]
  } else if (type === 'draw') {
    points = canvasSettings.lines[strokeIndex]
  }

  return points.reduce((len, point, index, line) => {
    if (index === 0) {
      return len
    }
    const prevPoint = line[index - 1]
    return getDist(prevPoint, point) + len
  }, 0)
}

function getDist (point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2))
}

const drawAmount = ref(0)
const canvasVisible = ref(true)
function hideCanvas () {
  canvasVisible.value = false
}

function showCanvas () {
  canvasVisible.value = true
}

const numberVisible = ref(false)
const highlightNumber = ref(false)
function hideNumber () {
  numberVisible.value = false
  highlightNumber.value = false
}

function showNumber () {
  numberVisible.value = true
}

function increaseNumber () {
  setTimeout(() => { drawAmount.value += 1; highlightNumber.value = true }, 600)
  setTimeout(hideNumber, 1400)
  animationData.reset()
  canvasSettings.reset()
  kanaSnap.value.clear()
  canvasSettings.context.clearRect(0, 0, kanaCanvas.value.width, kanaCanvas.value.height)
}

function getText (id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

function navTo (destination = '') {
  switch (destination) {
    case 'error':
      if (appDyn.writeKanji.data) {
        appDyn.writeKanji.data = null
        router.push({ name: 'training' })
      } else {
        router.push({ name: 'category', params: { destination: 'writeKanji' } })
      }
      appDyn.writeKanji.selectedWord = [{ categoryKey: '', index: 0 }, { categoryKey: '', index: 0 }]
      appDyn.writeKanji.selectedTab = 0
      appDyn.writeKanji.selectedLetter = [0, 0]
      break
    default:
      router.push({ name: 'writeKanji' })
  }
}
</script>
