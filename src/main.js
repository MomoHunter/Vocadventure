import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.directive('maxFontSize', {
  inserted (el) {
    el.style.fontSize = (Math.min(el.offsetWidth, el.offsetHeight) * 0.8) + 'px'
  }
})

Vue.directive('square', {
  inserted (el) {
    if (el.offsetWidth < el.offsetHeight) {
      el.style.height = el.offsetWidth + 'px'
    } else {
      el.style.width = el.offsetHeight + 'px'
    }
  }
})

Vue.directive('focus', {
  inserted (el) {
    if (!el.hasAttribute('nofocus')) {
      el.focus()
    }
  }
})

Vue.directive('maxHeight', {
  inserted (el) {
    el.style.maxHeight = el.clientHeight + 'px'
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
