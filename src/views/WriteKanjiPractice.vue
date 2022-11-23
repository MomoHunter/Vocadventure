<template>
  <div class="page">
    <TheHero title="writeKanjiPracticeTitle" :subtitle="[currentLetter]" />
    <div class="flex-column margin-top-mini margin-bottom-mini margin-left-mini">
      <TheTag class="margin-bottom-mini" title="writeKanjiCategoryTag"
              :text="appConst.getCategoryName(currentWord.categoryKey)" color="info-2" />
      <TheTag title="writeKanjiDifficultyTag" :text="'difficulty' + currentWord.difficulty" color="info-2" />
    </div>
    <div class="flex-column flex-grow flex-center" @mousedown="startDraw($event, 'mouse')"
         @mouseup="endDraw($event, 'mouse')" @touchstart="startDraw($event, 'touch')"
         @touchend="endDraw($event, 'touch')">
      <div v-square class="special-font width-fifth-four height-fifth-four animate__animated duration-c-800ms"
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
    animationData.running = true
    animationLoop()
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
  wrongStrokeActive: false
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
    canvasSettings.lines.push([[canvasSettings.lastPoint.x, canvasSettings.lastPoint.y]])
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
  canvasSettings.lines[canvasSettings.lines.length - 1].push(
    [canvasSettings.lastPoint.x, canvasSettings.lastPoint.y]
  )
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
  const svgStrokeLength = getLineLength('svg', strokeIndex)
  const drawStrokeLength = getLineLength('draw', strokeIndex)
  
  const points = getPoints(strokeIndex, drawStrokeLength)
  const pointDiff = Math.abs(points.drawPoints.length - points.svgPoints.length)

  if (Math.max(points.svgPoints.length * 0.2, 2) < pointDiff) {
    canvasSettings.lines.pop()
    redrawCanvas()
    wrongStrokeAnimation()
    return
  }

  let data = {
    dist: 0,
    distances: [],
    avgDist: 0
  }
  for (let i = 0; i < Math.min(points.svgPoints.length, points.drawPoints.length); i++) {
    const svgPoint = points.svgPoints[i]
    const normDrawPoint = {
      x: points.drawPoints[i].x / canvasSettings.scaleFactor,
      y: points.drawPoints[i].y / canvasSettings.scaleFactor
    }
    let distance = Math.sqrt(Math.pow(svgPoint.x - normDrawPoint.x, 2) + Math.pow(svgPoint.y - normDrawPoint.y, 2))
    data.distances.push(distance)
    data.dist += distance
  }

  if (data.dist > data.distances.length * 4) {
    canvasSettings.lines.pop()
    redrawCanvas()
    wrongStrokeAnimation()
    return
  }
  
  data.avgDist = data.dist / data.distances.length
  for (let distance of data.distances) {
    if (Math.abs(distance - data.avgDist) > 2 || distance > 5) {
      canvasSettings.lines.pop()
      redrawCanvas()
      wrongStrokeAnimation()
      return
    }
  }

  if (animationData.currentStroke < kanaSvgPaths.value.length) {
    canvasSettings.strokeCount += 1
    animationData.running = true
    animationLoop()
  }
}

function redrawCanvas () {
  canvasSettings.context.clearRect(0, 0, kanaCanvas.value.width, kanaCanvas.value.height)
  for (const line of canvasSettings.lines) {
    const startPoint = line[0]
    let lineTail = line.slice(1).filter((_, index) => index % 4 === 0)
    Helper.drawCanvasLineCustom(
      startPoint[0], startPoint[1], canvasSettings.color, canvasSettings.width, 'round', [],
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

function getLineLength (type, index) {
  if (type === 'svg') {
    let strokeCopy = kanaSvgPaths.value[index].clone()
    strokeCopy = strokeCopy.transform(canvasSettings.scaleMatrix.toTransformString())
    return strokeCopy.getTotalLength()
  } else if (type === 'draw') {
    return canvasSettings.lines[index].reduce((len, point, index, line) => {
      if (index === 0) {
        return len
      }
      const prevPoint = line[index - 1]
      return Math.sqrt(Math.pow(point[0] - prevPoint[0], 2) + Math.pow(point[1] - prevPoint[1], 2)) + len
    }, 0)
  }
  return 0
}

function getPoints (index, drawStrokeLength, pointDist = 4) {
  let svgPoints = []
  let drawPoints = []
  let strokeLength = 0
  let strokeIndex = 0
  let strokeCopy = kanaSvgPaths.value[index].clone()
  strokeCopy = strokeCopy.transform(canvasSettings.scaleMatrix.toTransformString())
  for (let len = 0; len <= Math.max(strokeCopy.getTotalLength(), drawStrokeLength / canvasSettings.scaleFactor); len += pointDist) {
    if (len <= strokeCopy.getTotalLength()) {
      svgPoints.push(strokeCopy.getPointAtLength(len))
    }
    while (strokeLength < len * canvasSettings.scaleFactor &&
           strokeIndex < canvasSettings.lines[index].length - 1) {
      const prevPoint = canvasSettings.lines[index][strokeIndex - 1]
      const point = canvasSettings.lines[index][strokeIndex]
      strokeLength += Math.sqrt(Math.pow(point[0] - prevPoint[0], 2) + Math.pow(point[1] - prevPoint[1], 2))
      strokeIndex += 1
    }
    if (strokeLength === len * canvasSettings.scaleFactor) {
      drawPoints.push({
        x: canvasSettings.lines[index][strokeIndex][0],
        y: canvasSettings.lines[index][strokeIndex][1]
      })
      strokeIndex += 1
    } else if (strokeLength < len * canvasSettings.scaleFactor) {
      continue
    } else {
      const prevPoint = canvasSettings.lines[index][strokeIndex - 1]
      const point = canvasSettings.lines[index][strokeIndex]
      const dist = Math.sqrt(Math.pow(point[0] - prevPoint[0], 2) + Math.pow(point[1] - prevPoint[1], 2))
      const xDist = prevPoint[0] - point[0]
      const yDist = prevPoint[1] - point[1]
      let percentage = (strokeLength - (len * canvasSettings.scaleFactor)) / dist
      drawPoints.push({
        x: point[0] + xDist * percentage,
        y: point[1] + yDist * percentage
      })
    }
  }
  return {
    svgPoints,
    drawPoints
  }
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
