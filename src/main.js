import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './registerServiceWorker'
import 'snapsvg-cjs'
import '@/svg/snap-adjustments.js'
import '@/canvas/kanji/kanji-canvas.min.js'
import '@/canvas/kanji/kanji-canvas-adjustments.js'
import '@/canvas/kanji/ref-patterns.js'
import '@/canvas/kanji/ref-patterns-extra.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.directive('focus', {
  mounted (el) {
    if (!el.hasAttribute('nofocus') || el.getAttribute('nofocus') === 'false') {
      el.focus()
    }
  }
})

app.directive('square', {
  mounted (el) {
    if (el.offsetWidth < el.offsetHeight) {
      el.style.height = el.offsetWidth + 'px'
    } else {
      el.style.width = el.offsetHeight + 'px'
    }
  }
})

app.directive('fullsize', {
  mounted (el) {
    let boundingBox = el.parentElement.getBoundingClientRect()
    if (boundingBox.width < boundingBox.height) {
      el.setAttribute('width', boundingBox.width)
      el.setAttribute('height', boundingBox.width)
    } else {
      el.setAttribute('width', boundingBox.height)
      el.setAttribute('height', boundingBox.height)
    }
  }
})

app.mount('#app')
