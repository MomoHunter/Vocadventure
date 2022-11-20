<template>
  <div v-show="selfVisible" class="calendar" :class="getSizeClass('general')">
    <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
      <div v-show="props.visible" class="background width-full height-full absolute" @click="$emit('click')"></div>
    </transition>
    <div class="content-box">
      <transition enter-active-class="grow all duration-c-350ms" leave-active-class="shrink all duration-c-350ms"
                  @before-enter="toggleShowSelf()" @after-leave="toggleShowSelf()">
        <div v-show="props.visible" class="content">
          <TheHero class="mini" color="red" title="calendarTitle" :subtitle="subtitle" />
          <div class="day-grid-container tr-p-2 tr-d-350ms relative overflow-hidden flex-shrink" :class="gridConClass">
            <div class="day-grid tr-p-1 tr-d-350ms relative" :class="gridClass">
              <ButtonIcon class="width-full c-full r-1" icon="angle-up" color="action" @click="changeMonth(-1)" />
              <span class="header c-2 r-2">{{ getText('calendarWeek') }}</span>
              <span class="header c-3 r-2">{{ getText('calendarMonday') }}</span>
              <span class="header c-4 r-2">{{ getText('calendarTuesday') }}</span>
              <span class="header c-5 r-2">{{ getText('calendarWednesday') }}</span>
              <span class="header c-6 r-2">{{ getText('calendarThursday') }}</span>
              <span class="header c-7 r-2">{{ getText('calendarFriday') }}</span>
              <span class="header c-8 r-2">{{ getText('calendarSaturday') }}</span>
              <span class="header c-9 r-2">{{ getText('calendarSunday') }}</span>
              <transition-group tag="div" class="entries"
                                :enter-active-class="transitions.enter"
                                :leave-active-class="transitions.leave">
                <template v-for="entry in currentMonthDays" :key="getDayKey(entry)">
                  <ButtonText v-if="entry.type === 'week'" class="week c-1" :class="'r-' + (entry.weekIndex + 1)"
                              :text="entry.week" />
                  <div v-else class="day-box" :class="['c-' + (entry.dayOfWeek + 1), 'r-' + entry.weekIndex]">
                    <ButtonText class="width-full absolute" :text="entry.day" :color="getDayColor(entry.dayObj)"
                                :highlighted="entry.day === selectedDay"
                                @click="selectDay(entry.day, entry.weekIndex)" />
                    <div class="icon-box">
                      <span v-if="Math.random() < 0.75" class="icon green">
                        <i class="fas fa-gem"></i>
                      </span>
                      <span v-if="Math.random() < 0.2" class="icon yellow">
                        <i class="fas fa-award"></i>
                      </span>
                    </div>
                  </div>
                </template>
              </transition-group>
              <ButtonIcon class="width-full c-full r-4" icon="angle-down" color="action" @click="changeMonth(1)" />
            </div>
          </div>
          <div class="activities flex-shrink">
            <div ref="timelineEl" class="timeline margin-left-medium margin-right-medium"
                 @click="scrollTimeline($event.offsetY)">
              <div class="timeline-entry" :class="entry.pos" v-for="(entry, index) in activityEntries"
                   :style="{ 'top': `${entry.timeline.top}px`, 'height': `${entry.timeline.height}px` }"
                   :key="index"></div>
              <div ref="sliderEl" class="timeline-slider" :class="{ 'tr-p-3 tr-d-350ms': transitionActive }"
                   :style="{ 'top': `${sliderTop}px`, 'height': `${sliderHeight}px`}"></div>
            </div>
            <div class="flex-column flex-grow">
              <div ref="detailsEl" class="details overflow-auto margin-right-medium">
                <div ref="detailsConEl" class="details-container">
                  <div class="details-time-slot" v-for="time in 24" :key="time">
                    <div class="time">
                      {{ addZero(time - 1) }}:00
                    </div>
                  </div>
                  <div class="details-entry" :class="entry.pos" v-for="(entry, index) in activityEntries"
                      :style="{ 'top': `${entry.details.top}px`, 'height': `${entry.details.height}px` }"
                      :key="index" @click="showEntries(entry, entry.timeline.top)">
                    <div class="details-info flex-grow overflow-hidden">
                      <div v-if="entry.entries.length === 1" class="name">
                        {{ getText(entry.entries[0].name) }}
                      </div>
                      <div v-else-if="entry.entries.length > 1" class="name">
                        {{ getText('calendarMultipleEntries', entry.entries.length) }}
                      </div>
                    </div>
                    <Icon icon="angle-down" />
                  </div>
                </div>
              </div>
              <transition enter-active-class="grow all duration-c-350ms"
                          leave-active-class="shrink all duration-c-350ms" @after-leave="clearShownEntry()">
                <div v-show="entriesOpen" ref="entriesDetails"
                     class="entries-details margin-right-medium height-full overflow-auto">
                  <div v-for="(entry, index) in shownEntry.entries" class="entries-details-entry"
                       :class="shownEntry.type" :key="index">
                    <div class="flex-row">
                      <div class="title flex-grow">
                        {{ getText(entry.name) }}
                      </div>
                      <div v-if="shownEntry.type === 'adventure'" class="time">
                        {{ getFormattedTime(entry.startDate) }} - {{ getFormattedTime(entry.endDate) }}
                      </div>
                      <div v-else class="time">
                        {{ getFormattedTime(entry.startDate) }}
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
          <ButtonText class="width-full" text="Close" color="red" @click="closeButton()" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'

import TheHero from '@/components/TheHero.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonText from '@/components/ButtonText.vue'
import Icon from '@/components/Icon.vue'

import { useAppConstStore } from '@/stores/appconst'

const appConst = useAppConstStore()

const props = defineProps({
  visible: Boolean
})
defineEmits(['click'])

const selfVisible = ref(false)

function toggleShowSelf () {
  selfVisible.value = !selfVisible.value
  if (!selfVisible.value) {
    monthShift.value = 0
    resetDay()
    entriesOpen.value = false
    clearShownEntry()
  }
}

const subtitle = computed(() => {
  return ['calendarMonth' + currentDate.value[1].getMonth(), currentDate.value[1].getFullYear()]
})

const monthShift = ref(0)
const transitions = reactive({
  enter: '',
  leave: ''
})

function changeMonth (change) {
  monthShift.value += change
}

watch(
  () => monthShift.value,
  (newMonth, oldMonth) => {
    if (newMonth > oldMonth) {
      transitions.enter = 'animate__animated animate__fadeInUp duration-c-350ms delay-c-200ms'
      transitions.leave = 'animate__animated animate__fadeOutUp duration-c-350ms'
    } else {
      transitions.enter = 'animate__animated animate__fadeInDown duration-c-350ms delay-c-200ms'
      transitions.leave = 'animate__animated animate__fadeOutDown duration-c-350ms'
    }
  }
)

const currentDate = computed(() => {
  let date = new Date()
  date.setDate(1)
  date.setMonth(date.getMonth() + monthShift.value)
  return [new Date(), date] // current date, shown date
})

const currentMonthDays = computed(() => {
  let days = []
  let dayCount = 31
  switch (currentDate.value[1].getMonth()) {
    case 1: // febuary
      if (new Date(currentDate.value[1].getFullYear(), 1, 29).getDate() === 1) {
        dayCount = 28
      } else {
        dayCount = 29
      }
      break
    case 3: // april
    case 5: // june
    case 8: // september
    case 10: // november
      dayCount = 30
      break
    default:
  }

  for (let i = 1; i <= dayCount; i++) {
    const day = new Date(currentDate.value[1].getFullYear(), currentDate.value[1].getMonth(), i)
    const week = getWeek(day)
    if (!days.some((obj) => obj.type === 'week' && obj.week === week)) {
      days.push({
        type: 'week',
        week: week,
        weekIndex: days.filter((obj) => obj.type === 'week').length,
        month: currentDate.value[1].getMonth()
      })
    }
    days.push({
      type: 'day',
      day: i,
      dayOfWeek: day.getDay() || 7, // cause sunday should be last day of week
      dayObj: day,
      weekIndex: days.filter((obj) => obj.type === 'week').length,
      month: currentDate.value[1].getMonth()
    })
  }
  return days
})

function getDayKey (entry) {
  if (entry.type === 'week') {
    return entry.month + '-' + entry.week
  }
  return entry.month + '--' + entry.day
}

function getWeek (date) {
  let fourth = new Date(date.getFullYear(), 0, 4) //
  if (date.getMonth() === 0 && date.getDate() < 4 && (date.getDay() || 7) > (fourth.getDay() || 7)) {
    fourth.setFullYear(date.getFullYear() - 1)
  }
  let startOfWeek = fourth - (((fourth.getDay() || 7) - 1) * 86_400_000)
  return Math.ceil((((date - startOfWeek) / 86_400_000) + 1) / 7)
}

function getDayColor (date) {
  return currentDate.value[0].getFullYear() === date.getFullYear() &&
    currentDate.value[0].getMonth() === date.getMonth() &&
    currentDate.value[0].getDate() === date.getDate() ? 'selected' : 'info-2'
}

const gridClass = ref('')
const gridConClass = ref('')
const selectedDay = ref(0)
const sliderHeight = ref(0)
const timelineDiff = ref(0) // the difference between timeline and details height
const timelineScrolling = ref(false)
const hasScrollEvLi = ref(false)
const transitionActive = ref(true)
let abortContr = null
function selectDay (day, weekIndex) {
  const timelineHeight = timelineEl.value.getBoundingClientRect().height - 6 // 6 cause of the border
  const detailsHeight = detailsEl.value.getBoundingClientRect().height - 6 // 6 cause of the border
  const detailsConHeight = detailsConEl.value.getBoundingClientRect().height

  gridClass.value = `small-height top-${weekIndex}`
  gridConClass.value = 'medium-margin'
  selectedDay.value = day
  if (!hasScrollEvLi.value) {
    abortContr = new AbortController()
    detailsEl.value.addEventListener('scroll', async (e) => {
      if (!timelineScrolling.value) {
        transitionActive.value = false
        sliderTop.value = e.target.scrollTop / timelineDiff.value

        await nextTick() // updates DOM

        transitionActive.value = true
      }
    },
    {
      signal: abortContr.signal
    })
    hasScrollEvLi.value = true
  }
  sliderTop.value = 0

  const visibleArea = (detailsHeight / detailsConHeight)
  sliderHeight.value = Math.round(visibleArea * timelineHeight)

  timelineDiff.value = Math.round(detailsConHeight * (1 - visibleArea)) / Math.round(timelineHeight - sliderHeight.value)

  timelineScrolling.value = true
  requestAnimationFrame((newTS) => scrollAnim(newTS))
}

function resetDay () {
  gridClass.value = ''
  gridConClass.value = ''
  selectedDay.value = 0
  if (abortContr !== null) {
    abortContr.abort()
  }
  hasScrollEvLi.value = false
}

const testEntries = [
  {
    type: 'adventure',
    name: 'adventure',
    start: 1657938123000,
    end: 1657941723000
  },
  {
    type: 'adventure',
    name: 'kanjiQuiz',
    start: 1657968123000,
    end: 1657992723000
  },
  {
    type: 'adventure',
    name: 'adventure',
    start: 1657999723000,
    end: 1658032723000
  },
  {
    type: 'achievement',
    name: 'achievementsStartGameTitle',
    start: 1657938123000,
    end: 1657938123000
  },
  {
    type: 'achievement',
    name: 'achievementsRandomAckDesc',
    start: 1657938123000,
    end: 1657938123000
  },
  {
    type: 'achievement',
    name: 'achievementsStartGameDesc',
    start: 1657938323000,
    end: 1657938323000
  }
]

const activityEntries = computed(() => {
  let results = []
  let timelineHeight = 0
  let detailsConHeight = 0
  if (timelineEl.value !== null) {
    timelineHeight = timelineEl.value.getBoundingClientRect().height - 6 // 6 cause of the border
  }
  if (detailsConEl.value !== null) {
    detailsConHeight = detailsConEl.value.getBoundingClientRect().height
  }
  for (let entry of testEntries) {
    let newEntry = {
      timeline: {
        top: null,
        height: null
      },
      details: {
        top: null,
        height: null
      },
      type: entry.type,
      pos: entry.type === 'adventure' ? 'left' : 'right',
      entries: [{
        name: entry.name || '',
        startDate: new Date(entry.start),
        endDate: new Date(entry.end)
      }],
      startDate: new Date(entry.start),
      endDate: new Date(entry.end)
    }

    if (newEntry.startDate.getFullYear() === currentDate.value[1].getFullYear() &&
        newEntry.startDate.getMonth() === currentDate.value[1].getMonth() &&
        newEntry.startDate.getDate() === selectedDay.value) {
      let secs = (newEntry.startDate.getHours() * 3_600) +
                 (newEntry.startDate.getMinutes() * 60) +
                 newEntry.startDate.getSeconds()
      let top = (secs / 86_400) * timelineHeight
      let covered = false
      for (let result of results) {
        if (top >= result.timeline.top && top <= result.timeline.top + result.timeline.height &&
            newEntry.pos === result.pos) {
          result.entries = result.entries.concat(newEntry.entries)
          covered = true
          break
        }
      }
      if (!covered) {
        newEntry.timeline.top = top
        newEntry.details.top = newEntry.timeline.top * (detailsConHeight / timelineHeight)
      } else {
        continue
      }
    }

    if (newEntry.endDate.getFullYear() === currentDate.value[1].getFullYear() &&
        newEntry.endDate.getMonth() === currentDate.value[1].getMonth() &&
        newEntry.endDate.getDate() === selectedDay.value) {
      let secs = (newEntry.endDate.getHours() * 3_600) +
                 (newEntry.endDate.getMinutes() * 60) +
                 newEntry.endDate.getSeconds()
      let covered = false
      for (let result of results) {
        if (result.timeline.top === 0 && newEntry.pos === result.pos) {
          result.entries = result.entries.concat(newEntry.entries)
          covered = true
          break
        }
      }
      if (covered) {
        continue
      }

      if (newEntry.timeline.top === null) {
        newEntry.timeline.top = 0
        newEntry.details.top = 0
      }
      newEntry.timeline.height = Math.max(
        ((secs / 86_400) * timelineHeight) - newEntry.timeline.top,
        5 * getSizeClass('style')
      )
      newEntry.details.height = newEntry.timeline.height * (detailsConHeight / timelineHeight)
    } else if (newEntry.timeline.top !== null) {
      newEntry.timeline.height = Math.max(timelineHeight - newEntry.timeline.top, 5)
      newEntry.details.height = newEntry.timeline.height * (detailsConHeight / timelineHeight)
    }

    if (newEntry.timeline.top !== null) {
      results.push(newEntry)
    }
  }
  return results
})

const timelineEl = ref(null)
const sliderEl = ref(null)
const detailsEl = ref(null)
const detailsConEl = ref(null)
const sliderTop = ref(0)
function scrollTimeline (newY) {
  const timelineHeight = timelineEl.value.getBoundingClientRect().height - 6 // 6 cause of the border

  sliderTop.value = Math.max(Math.min(timelineHeight - sliderHeight.value, newY - (sliderHeight.value / 2)), 0)

  timelineScrolling.value = true
  requestAnimationFrame((newTS) => scrollAnim(newTS))
}
// bezier-curve Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3
// ease-in-out ((Math.pow(1 - t, 3) * 0.42) + (3 * (1 - t) * Math.pow(t, 2) * 0.58) + Math.pow(t, 3))
// ease-in-out 3 * (1 - t) * Math.pow(t, 2) + Math.pow(t, 3)
// ease 3 * pow(1 - t, 2) * t * 0.1 + 3 * (1 - t) * pow(t, 2) + pow(t, 3)

const scrollAnimValues = reactive({
  duration: 350,
  currTime: 0,
  lastTS: -1
})
function scrollAnim (timestamp = 0) {
  if (scrollAnimValues.currTime < scrollAnimValues.duration) {
    requestAnimationFrame((newTS) => scrollAnim(newTS))
    if (scrollAnimValues.lastTS === -1) {
      scrollAnimValues.lastTS = timestamp
    }
    scrollAnimValues.currTime += timestamp - scrollAnimValues.lastTS

    detailsEl.value.scrollTop = sliderEl.value.offsetTop * timelineDiff.value

    scrollAnimValues.lastTS = timestamp
  } else {
    scrollAnimValues.currTime = 0
    scrollAnimValues.lastTS = -1
    detailsEl.value.scrollTop = sliderEl.value.offsetTop * timelineDiff.value
    timelineScrolling.value = false
  }
}

const entriesOpen = ref(false)
const shownEntry = ref({ entries: [] })
const entriesDetails = ref(null)
async function showEntries (entry, entryTimelineY) {
  shownEntry.value = entry
  const timelineHeight = timelineEl.value.getBoundingClientRect().height - 6 // 6 cause of the border
  const detailsConHeight = detailsConEl.value.getBoundingClientRect().height
  entriesOpen.value = true
  scrollTimeline(entryTimelineY + (sliderHeight.value / 2) - 1)
  requestAnimationFrame((newTS) => resizeAnim(newTS, timelineHeight, detailsConHeight))

  await nextTick() // updates DOM
  
  entriesDetails.value.scrollTop = 0
}

const resizeAnimValues = reactive({
  duration: 350,
  currTime: 0,
  lastTS: -1
})
function resizeAnim (timestamp = 0, timelineHeight, detailsConHeight) {
  if (resizeAnimValues.currTime < resizeAnimValues.duration) {
    requestAnimationFrame((newTS) => resizeAnim(newTS, timelineHeight, detailsConHeight))
    if (resizeAnimValues.lastTS === -1) {
      resizeAnimValues.lastTS = timestamp
    }
    resizeAnimValues.currTime += timestamp - resizeAnimValues.lastTS

    const detailsHeight = detailsEl.value.getBoundingClientRect().height - 6 // 6 cause of the border

    const visibleArea = (detailsHeight / detailsConHeight)
    sliderHeight.value = Math.round(visibleArea * timelineHeight)

    resizeAnimValues.lastTS = timestamp
  } else {
    resizeAnimValues.currTime = 0
    resizeAnimValues.lastTS = -1

    const detailsHeight = detailsEl.value.getBoundingClientRect().height - 6 // 6 cause of the border

    const visibleArea = (detailsHeight / detailsConHeight)
    sliderHeight.value = Math.round(visibleArea * timelineHeight)
  }
}

function closeButton () {
  if (entriesOpen.value) {
    const timelineHeight = timelineEl.value.getBoundingClientRect().height - 6 // 6 cause of the border
    const detailsConHeight = detailsConEl.value.getBoundingClientRect().height
    entriesOpen.value = false
    requestAnimationFrame((newTS) => resizeAnim(newTS, timelineHeight, detailsConHeight))
  } else {
    resetDay()
  }
}

function clearShownEntry () {
  shownEntry.value = { entries: [] }
}

function getText (id, ...params) {
  return appConst.getText(id, ...params)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

function getFormattedTime (dateObj) {
  return `${addZero(dateObj.getHours())}:${addZero(dateObj.getMinutes())}:${addZero(dateObj.getSeconds())}`
}

function addZero (number) {
  return number > 9 ? number : '0' + number
}
</script>

<style lang="scss" scoped>
</style>
