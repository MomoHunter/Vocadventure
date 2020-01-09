import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBook, faGem, faShoppingCart, faCog, faArrowLeft, faPen, faCheck, faTrash, faTimes, faGlobe, faPalette,
  faExpandArrowsAlt, faUserGraduate, faHome, faSort, faFilter
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faBook, faGem, faShoppingCart, faCog, faArrowLeft, faPen, faCheck, faTrash, faTimes, faGlobe, faPalette,
  faExpandArrowsAlt, faUserGraduate, faHome, faSort, faFilter
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
