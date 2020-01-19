import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faBook, faGem, faShoppingCart, faCog, faArrowLeft, faArrowRight, faPen, faCheck, faTrash, faTimes, faGlobe, faPalette,
  faExpandArrowsAlt, faUserGraduate, faHome, faSort, faSortUp, faSortDown, faSearch
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(
  faBook, faGem, faShoppingCart, faCog, faArrowLeft, faArrowRight, faPen, faCheck, faTrash, faTimes, faGlobe, faPalette,
  faExpandArrowsAlt, faUserGraduate, faHome, faSort, faSortUp, faSortDown, faSearch
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
