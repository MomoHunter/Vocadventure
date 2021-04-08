import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
/* import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBook, faGem, faShoppingCart, faCog, faArrowLeft, faArrowRight, faPen, faCheck, faTrash, faTimes, faGlobe, faPalette,
  faExpandArrowsAlt, faUserGraduate, faHome, faSort, faSortUp, faSortDown, faSearch, faCoins, faBriefcase, faEye,
  faEyeSlash, faClipboardCheck, faAngleDown, faAngleUp, faEdit, faBackspace, faLongArrowAltDown, faLongArrowAltLeft,
  faLongArrowAltRight, faLongArrowAltUp, faMap, faVolumeUp, faVolumeOff, faVolumeMute, faSyncAlt, faCheckSquare, faList,
  faPlus, faMinus, faGlasses, faClipboardList, faAngleDoubleUp, faTasks, faTag, faFont, faDownload, faUpload,
  faExclamation, faSquare, faInfoCircle, faShoePrints, faBookDead, faSkullCrossbones
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faBook, faGem, faShoppingCart, faCog, faArrowLeft, faArrowRight, faPen, faCheck, faTrash, faTimes, faGlobe, faPalette,
  faExpandArrowsAlt, faUserGraduate, faHome, faSort, faSortUp, faSortDown, faSearch, faCoins, faBriefcase, faEye,
  faEyeSlash, faClipboardCheck, faAngleDown, faAngleUp, faEdit, faBackspace, faLongArrowAltDown, faLongArrowAltLeft,
  faLongArrowAltRight, faLongArrowAltUp, faMap, faVolumeUp, faVolumeOff, faVolumeMute, faSyncAlt, faCheckSquare, faList,
  faPlus, faMinus, faGlasses, faClipboardList, faAngleDoubleUp, faTasks, faTag, faFont, faDownload, faUpload,
  faExclamation, faSquare, faInfoCircle, faShoePrints, faBookDead, faSkullCrossbones
)

Vue.component('font-awesome-icon', FontAwesomeIcon) */

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
