<template>
  <div class="page">
    <TheHero title="writeKanjiTitle" :subtitle="[currentWord[savestate.app.lang]]" />
    <div class="action-container" :class="[{ 'overflow-hidden': practiceRunning }, getSizeClass('general')]">
      <DropdownButton icon="list" color="action" label="writeKanjiDropdown" :dropdownVisible="dropdownVisible"
                      @dropdown="toggleDropdown()" />
    </div>
    <div class="flex-grow flex-column relative"
         :class="{ 'overflow-auto': !dropdownVisible, 'overflow-hidden': dropdownVisible }">
      <DropdownMenu v-show="dropdownVisible" class="absolute width-full height-full overflow-hidden" color="action"
                    :selected-word="appDyn.writeKanji.selectedWord[appDyn.writeKanji.selectedTab]"
                    :selected-tab="appDyn.writeKanji.selectedTab"
                    :tabs="['writeKanjiDropdownTab1', 'writeKanjiDropdownTab2']" :vocabs="words"
                    @new-word="newCurrentWord($event, appDyn.writeKanji.selectedTab)" @new-tab="selectTab($event)" />
      <div class="flex-column margin-top-mini margin-left-mini">
        <TheTag class="margin-bottom-mini" title="writeKanjiCategoryTag"
                :text="appConst.getCategoryName(currentWord.categoryKey)" color="info-2" />
        <TheTag title="writeKanjiDifficultyTag" :text="'difficulty' + currentWord.difficulty" color="info-2" />
      </div>
      <!-- <div class="flex-row flex-wrap margin-bottom-medium">
        <ButtonBasic class="width-half" text="writeKanjiButton4" icon="backward-step" color="action"
                     @click="previousStroke()" :disabled="!animationActive && !animationPaused" />
        <ButtonBasic class="width-half" text="writeKanjiButton5" icon="forward-step" color="action"
                     @click="nextStroke()" :disabled="!animationActive && !animationPaused" />
      </div> -->
      <div class="flex-grow flex-column flex-center">
        <div class="flex-row flex-center margin-bottom-large width-full">
          <div class="special-font" :class="getSizeClass('general')">
            <div class="background">
              <div class="top left has-alpha"></div>
              <div class="top right has-alpha"></div>
              <div class="bottom left has-alpha"></div>
              <div class="bottom right has-alpha"></div>
            </div>
            <svg id="kanaSvg" class="text-gold svg" :width="getSizeClass('style') * 200"
                :height="getSizeClass('style') * 200"></svg>
          </div>
        </div>
        <div class="flex-row flex-center-v width-full">
          <ButtonIcon v-show="!animationActive" class="width-eighth" icon="play" color="green"
                      @click="startAnimation()" />
          <ButtonIcon v-show="animationActive" class="width-eighth" icon="pause" color="yellow"
                      @click="pauseAnimation()" />
          <ButtonIcon class="width-eighth" icon="stop" color="red" @click="stopAnimation()"
                      :disabled="!animationActive && !animationPaused" />
          <ButtonIcon class="width-eighth" icon="backward-step" color="action"
                      @click="previousStroke()" :disabled="!animationActive && !animationPaused" />
          <ButtonIcon class="width-eighth" icon="forward-step" color="action"
                      @click="nextStroke()" :disabled="!animationActive && !animationPaused" />
        </div>
      </div>
      <TheSlider class="margin-bottom-medium" title="writeKanjiSliderTitle" :min="1"
                 :max="50" :step="1" v-model="savestate.app.writeKanjiAnimationSpeed" icon="gauge-high" />
      <!-- <canvas id="kanji" :width="getSizeClass('style') * 200" :height="getSizeClass('style') * 200"></canvas>
      <div>{{result}}</div>
      <ButtonBasic text="Recognize" icon="search" color="green" @click="findKanji()" />
      <ButtonBasic text="Clear" icon="times" color="red" @click="clearKanji()" /> -->
      <!-- <div class="flex-row">
        <div v-show="currentKanjiData.on.length > 0" class="flex-column flex-center-h width-half">
          <div>
            on-Reading
          </div>
          <div v-for="(reading, index) in currentKanjiData.on" class="margin-left-small margin-right-small" :key="index">
            {{ reading }}
          </div>
        </div>
        <div v-show="currentKanjiData.kun.length > 0" class="flex-column flex-center-h width-half">
          <div>
            kun-Reading
          </div>
          <div v-for="(reading, index) in currentKanjiData.kun" class="margin-left-small margin-right-small" :key="index">
            {{ reading }}
          </div>
        </div>
      </div> -->
    </div>
    <!-- <div v-show="!dropdownVisible" class="flex-grow flex-column">
      <div class="flex-column margin-top-mini margin-bottom-mini margin-left-mini">
        <TagBasic class="margin-bottom-mini" title="writeKanjiCategoryTag" :text="categoryName" color="info-2" />
        <TagBasic title="writeKanjiDifficultyTag" :text="difficulty" color="info-2" />
      </div>
      <div ref="letter" class="special-font flex-grow flex-row flex-center" :class="getSizeClass('general')" @mousedown="setDrawOn($event, 'mouse')"
           @mouseup="setDrawOff()" @touchstart="setDrawOn($event, 'touch')" @touchend="setDrawOff()" v-maxFontSize>
        <canvas ref="checkKana" class="canvas" v-square></canvas>
        <div class="background" v-square>
          <div v-show="drawActive" class="score">{{ drawScore }}%</div>
          <div class="top left has-alpha"></div>
          <div class="top right has-alpha"></div>
          <div class="bottom left has-alpha"></div>
          <div class="bottom right has-alpha"></div>
        </div>
        <div v-show="!drawActive" class="letter">
          {{ currentLetter }}
        </div>
        <canvas ref="drawKana" class="canvas in-front" @mousemove="drawLine($event, 'mouse')"
                @touchmove="drawLine($event, 'touch')" v-square></canvas>
      </div>
    </div> -->
    <div v-show="!dropdownVisible" class="button-container flex-row overflow-x-auto overflow-y-hidden flex-shrink">
      <ButtonText :class="{ 'single-2': appDyn.writeKanji.selectedLetter[appDyn.writeKanji.selectedTab] === index }"
                  v-for="(letter, index) in currentWord[words.foreignAlphabet]" color="info" :text="letter"
                  :key="index" @click="setLetterIndex(index, appDyn.writeKanji.selectedTab)" />
    </div>
    <!-- <div v-show="drawActive" class="button-container">
      <ButtonBasic class="width-half" icon="times" color="red" text="writeKanjiButton3" @click="deactivateDraw()" />
      <ButtonBasic class="width-half" icon="trash" color="action" text="writeKanjiButton4" @click="clearCanvas()" />
    </div> -->
    <div class="button-container">
      <ButtonBasic class="width-half" icon="graduation-cap" color="info" text="writeKanjiButton7"
                   @click="navTo('practice')" />
      <ButtonBasic class="width-half" icon="clipboard-question" color="green" text="writeKanjiButton8"
                   @click="navTo('quiz')" />
      <ButtonBasic class="width-full" icon="arrow-left" color="red" text="writeKanjiButton6" @click="navTo()" />
      <!-- <ButtonBasic class="width-half" icon="pen" color="action" text="writeKanjiButton2" @click="activateDraw()"
                   :disabled="drawActive" /> -->
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import DropdownButton from '@/components/DropdownButton.vue'
import DropdownMenu from '@/components/DropdownMenu.vue'
import ButtonText from '@/components/ButtonText.vue'
import TheSlider from '@/components/TheSlider.vue'
import TheTag from '@/components/TheTag.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppDynStore } from '@/stores/appdyn'
import { useAppConstStore } from '@/stores/appconst'

import Kana from '@/data/special/kana.json'
import KanjiData from '@/data/special/kanji_data.json'

const router = useRouter()
const savestate = useSavestateStore()
const appDyn = useAppDynStore()
const appConst = useAppConstStore()

onBeforeMount(() => {
  let kanaCategoryKey = `[${Kana.tag}] ${Kana.categories[0][savestate.app.lang]}`
  if (appDyn.writeKanji.data !== null) {
    newCurrentWord(appDyn.writeKanji.data, 0)
    newCurrentWord({ categoryKey: kanaCategoryKey, index: 0 }, 1)
  } else if (appDyn.categoriesChosen.length === 0) {
    navTo()
  } else {
    if (appDyn.writeKanji.selectedWord[0].categoryKey === '') {
      newCurrentWord({ categoryKey: appDyn.categoriesChosen[0], index: 0 }, 0)
    } else {
      newCurrentWord(appDyn.writeKanji.selectedWord[0], 0)
    }
    if (appDyn.writeKanji.selectedWord[1].categoryKey === '') {
      newCurrentWord({ categoryKey: kanaCategoryKey, index: 0 }, 1)
    } else {
      newCurrentWord(appDyn.writeKanji.selectedWord[1], 1)
    }
  }
  const computedStyle = getComputedStyle(document.body)
  const color = computedStyle.color.replaceAll(/(.*\(|\)| )/g, '').split(',')
  svgColor.value = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
})

onMounted(() => {
  kanaSvgEl.value = new Snap('#kanaSvg')
  drawFullKana()
  // KanjiCanvas.init('kanji')
})
  // paths.forEach((path, index) => {
  //   console.log(path.getTotalLength())
  //   let newPath = kanaSvg.path(Snap.path.getSubpath(path, 0, path.getTotalLength() * 0.5))
  //   newPath.attr({
  //     stroke: '#fff',
  //     strokeWidth: 5
  //   })
  //   kanaSvg.append(newPath)
  // })
  // element = new Snap(f.node.children)
  // console.log(element)
  // kanaSvg.append()
  // let objElement = document.createElement('object')
  // objElement.addEventListener('load', () => {
  //   console.log('loaded')
  //   let newDoc = objElement.contentDocument
  //   console.log(newDoc.getElementById('kvg:0f9a8-s1'))
  // })
  // objElement.type = 'image/svg+xml'
  // objElement.data = TestKanjiVG
  // shadow.value.appendChild(objElement)

const practiceRunning = ref(false)

function startPractice () {
  // if (dropdownVisible.value) {
  //   toggleDropdown()
  // }
  // practiceRunning.value = true
  router.push({ name: 'writeKanjiPractice' })
}

const result = ref('')

function findKanji () {
  result.value = KanjiCanvas.recognize('kanji')
}

function clearKanji () {
  KanjiCanvas.erase('kanji')
}

const dropdownVisible = ref(false)

function toggleDropdown () {
  dropdownVisible.value = !dropdownVisible.value
}

const words = computed(() => {
  if (appDyn.writeKanji.selectedTab === 0) {
    let newVocabs = appConst.getFullVocabs(false)
    let newWordsObj = {}
    for (let word of newVocabs.words) {
      if (!newWordsObj.hasOwnProperty(word.categoryKey)) {
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

function selectTab (index) {
  appDyn.writeKanji.selectedTab = index
  setLetterIndex(appDyn.writeKanji.selectedLetter[index], index)
}

function newCurrentWord (word, tabIndex) {
  appDyn.writeKanji.selectedWord[tabIndex].categoryKey = word.categoryKey
  appDyn.writeKanji.selectedWord[tabIndex].index = word.index
  setLetterIndex(appDyn.writeKanji.selectedLetter[tabIndex], tabIndex)
  dropdownVisible.value = false
}

const currentWord = computed(() => {
  let selected = appDyn.writeKanji.selectedWord[appDyn.writeKanji.selectedTab]
  if (appDyn.categoriesChosen.length > 0 && words.value.words.hasOwnProperty(selected.categoryKey)) {
    return words.value.words[selected.categoryKey][selected.index]
  }
  return {}
})

function setLetterIndex (newIndex, tabIndex) {
  appDyn.writeKanji.selectedLetter[tabIndex] = newIndex
  animationActive.value = false
  if (animationPaused.value) {
    animationPaused.value = false
  }
  getSvgPaths()
}

const kanaSvgEl = ref(null)
const currentSvgPaths = ref(null)
const currentCodePoint = ref('')
const svgColor = ref('rgb(0, 0, 0)')
const scaleMatrix = computed(() => {
  return Snap.matrix().scale(getSizeClass('style') * 1.8)
})
const currentKanjiData = computed(() => {
  return KanjiData[currentCodePoint.value] || { literal: '', on: [], kun: [] }
})

function getSvgPaths () {
  const currentLetter = currentWord.value[words.value.foreignAlphabet][
    appDyn.writeKanji.selectedLetter[appDyn.writeKanji.selectedTab]
  ]
  let codePoint = currentLetter.codePointAt(0).toString(16)
  while (codePoint.length < 5) {
    codePoint = '0' + codePoint
  }
  currentCodePoint.value = codePoint
  currentSvgPaths.value = appConst.kanaSvg.selectAll(`path[id*="${codePoint}-s"]`)
  if (kanaSvgEl.value !== null) {
    drawFullKana()
  }
}

function drawFullKana () {
  kanaSvgEl.value.clear()
  if (currentSvgPaths.value) {
    currentSvgPaths.value.forEach((path) => {
      let newPath = path.clone()
      newPath.attr({
        fill: 'transparent',
        stroke: svgColor.value,
        strokeWidth: 3,
        strokeLinecap: 'round'
      })
      newPath.transform(scaleMatrix.value.toTransformString())
      kanaSvgEl.value.append(newPath)
    })
  }
}

const animationActive = ref(false)
const animationPaused = ref(false)

function startAnimation () {
  animationActive.value = true
  if (animationPaused.value) {
    animationPaused.value = false
  } else {
    animationData.reset()
  }
  animationLoop(animationData.lag)
}

function pauseAnimation () {
  animationPaused.value = true
  animationActive.value = false
}

function stopAnimation () {
  animationActive.value = false
  animationPaused.value = false
  drawFullKana()
}

const animationData = reactive({
  raf: null,
  lag: 0,
  startTS: 0,
  refreshrate: 1000 / 60,
  frameNo: 0,
  currentStroke: 0,
  currentStrokeLength: 0,
  reset: () => {
    animationData.raf = null
    animationData.lag = 0
    animationData.startTS = 0
    animationData.frameNo = 0
    animationData.currentStroke = 0
    animationData.currentStrokeLength = 0
  }
})

function animationLoop (timestamp) {
  if (animationActive.value) {
    const raf = requestAnimationFrame((newTS) => animationLoop(newTS))
    animationData.raf = raf
    animationData.lag += timestamp - animationData.startTS
  
    while (animationData.lag > animationData.refreshrate) {
      animationData.frameNo += 1
  
      animationUpdate()
  
      if (animationData.lag > animationData.refreshrate * 5) {
        animationData.lag %= animationData.refreshrate
      } else {
        animationData.lag -= animationData.refreshrate
      }
    }
  
    kanaSvgEl.value.clear()
    animationDraw()
  
    animationData.startTS = timestamp
  }
}

function animationUpdate () {
  let animSpeed = (savestate.app.writeKanjiAnimationSpeed / 20) * getSizeClass('style')
  currentSvgPaths.value.forEach((path, index) => {
    if (index === animationData.currentStroke) {
      let negPercentage = 1 - (animationData.currentStrokeLength / path.getTotalLength())
      animationData.currentStrokeLength += Math.min(
        animSpeed,
        animSpeed * Math.pow((negPercentage + 0.5), 2)
      )
      if (path.getTotalLength() <= animationData.currentStrokeLength) {
        animationData.currentStrokeLength = 0
        animationData.currentStroke += 1
        if (animationData.currentStroke === currentSvgPaths.value.length) {
          animationActive.value = false
        }
      }
      return false
    }
  })
}

function animationDraw () {
  currentSvgPaths.value.forEach((path, index) => {
    if (index < animationData.currentStroke) {
      let newPath = path.clone()
      newPath.attr({
        fill: 'transparent',
        stroke: svgColor.value,
        strokeWidth: 3,
        strokeLinecap: 'round'
      })
      newPath.transform(scaleMatrix.value.toTransformString())
      kanaSvgEl.value.append(newPath)
    } else if (index === animationData.currentStroke) {
      let newPath = kanaSvgEl.value.path(Snap.path.getSubpath(path, 0, animationData.currentStrokeLength))
      newPath.attr({
        fill: 'transparent',
        stroke: '#b22',
        strokeWidth: 3,
        strokeLinecap: 'round'
      })
      newPath.transform(scaleMatrix.value.toTransformString())
      kanaSvgEl.value.append(newPath)
      return false
    }
  })
}

function previousStroke () {
  if (animationData.currentStroke > 0) {
    animationData.currentStroke -= 1
  }
  animationData.currentStrokeLength = 0
  if (animationPaused.value) {
    kanaSvgEl.value.clear()
    animationDraw()
  }
}

function nextStroke () {
  animationData.currentStroke += 1
  animationData.currentStrokeLength = 0
  if (animationPaused.value) {
    kanaSvgEl.value.clear()
    animationDraw()
  }
  if (animationData.currentStroke === currentSvgPaths.value.length) {
    animationActive.value = false
    animationPaused.value = false
    kanaSvgEl.value.clear()
    animationDraw()
  }
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

function navTo (destination = '') {
  switch (destination) {
    case 'practice':
      router.push({ name: 'writeKanjiPractice' })
      break
    case 'quiz':
      router.push({ name: 'writeKanjiQuiz' })
      break
    default:
      if (appDyn.writeKanji.data) {
        appDyn.writeKanji.data = null
        router.push({ name: 'training' })
      } else {
        router.push({ name: 'category', params: { destination: 'writeKanji' } })
      }
      appDyn.writeKanji.selectedWord = [{ categoryKey: '', index: 0 }, { categoryKey: '', index: 0 }]
      appDyn.writeKanji.selectedTab = 0
      appDyn.writeKanji.selectedLetter = [0, 0]
  }
}
</script>

<style lang="scss" scoped>
#kanji {
  width: 200px;
}
</style>
