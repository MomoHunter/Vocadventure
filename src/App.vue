<template>
  <div ref="app" id="app" class="height-full flex-column">
    <TheStatus :status="$store.state.vueDict.status" />
    <div class="flex-grow width-full relative">
      <transition :enter-active-class="enterTransition" :leave-active-class="leaveTransition"
                  @after-enter="toggleTransitionActive(true)" @before-enter="toggleTransitionActive(false)">
        <router-view></router-view>
      </transition>
    </div>
    <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
      <ModalAreYouSure v-show="modalName === 'areYouSure'" />
    </transition>
    <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms"
                leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
      <ModalMessage v-if="$store.state.vueDict.showModals.name === 'message'" :options="$store.state.vueDict.showModals"
                    @click="$store.commit('vueDict/modalAnswer', $event)" />
    </transition>
  </div>
</template>

<script>
import Store from '@/store/index.js'
import TheStatus from '@/components/TheStatus.vue'
import ModalAreYouSure from '@/components/ModalAreYouSure.vue'
import ModalMessage from '@/components/ModalMessage.vue'

export default {
  name: 'App',
  store: Store,
  components: {
    TheStatus,
    ModalAreYouSure,
    ModalMessage
  },
  data () {
    return {
      enterTransition: '',
      leaveTransition: ''
    }
  },
  created () {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.onmessage = (event) => {
        if (event.data) {
          switch (event.data.type) {
            case 'newUpdate':
              this.newUpdate()
              break
            case 'updateFinished':
              if (this.$store.state.missedUpdates && this.$store.state.allowUpdates) {
                this.$store.commit('resetMissedUpdates')
                this.$store.commit('updateSuccessful')
                window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
                location.reload()
              } else {
                this.$store.commit('updateSuccessful')
                window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
                this.updateFinished()
              }
              break
            default:
          }
        }
      }
    }
  },
  mounted () {
    let spinner = document.getElementById('spinner')

    if (window.screen.width * window.devicePixelRatio < 1150) {
      this.$store.commit('changeViewport', 0.75)
    }

    this.loadData()
    // this.$store.commit('canvasDict/setSpritesheet')

    if (spinner && spinner.parentNode) {
      spinner.parentNode.removeChild(spinner)
    }

    if (navigator.serviceWorker) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && !registration.waiting && this.$store.state.allowUpdates && this.$store.state.missedUpdates) {
          this.$store.commit('newUpdate')
          setTimeout(() => {
            navigator.serviceWorker.controller.postMessage({
              type: 'update'
            })
          }, 3000)
        }
      })
    }
  },
  computed: {
    modalName () {
      return this.$store.state.vueDict.showModals.name
    }
  },
  methods: {
    newUpdate () {
      this.$store.commit('newUpdate')
      window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
    },
    updateFinished () {
      this.$store.commit('updateFinished')
    },
    loadData () {
      let data = JSON.parse(window.localStorage.getItem('globalDict'))

      if (data && data.version) {
        if (data.lang) {
          this.$store.commit('changeLanguage', data.lang)
        }
        if (data.targetLanguage) {
          this.$store.commit('changeTargetLanguage', data.targetLanguage)
        }
        if (data.theme) {
          this.$store.commit('changeTheme', data.theme)
        }
        if (data.size) {
          this.$store.commit('changeSize', data.size)
        }
        if (data.viewport) {
          this.$store.commit('changeViewport', data.viewport)
        }
        if (data.volume) {
          this.$store.commit('changeVolume', data.volume)
        }
        if (typeof data.allowUpdates === 'boolean') {
          this.$store.commit('changeAllowUpdates', data.allowUpdates)
        }
        if (typeof data.missedUpdates === 'boolean') {
          this.$store.commit('changeMissedUpdates', data.missedUpdates)
        }
        if (data.status) {
          this.$store.commit('vueDict/changeStatus', data.status)
        }
        if (data.categoriesPlayed) {
          this.$store.commit('vueDict/changeCategoriesPlayed', data.categoriesPlayed)
        }
        if (data.activeWordPacks) {
          this.$store.commit('vueDict/changeActiveWordPacks', data.activeWordPacks)
        }
        if (data.inventory) {
          this.$store.commit('vueDict/changeInventory', data.inventory)
        }
        if (data.unlockedItems) {
          for (let item of data.unlockedItems) {
            this.$store.commit('vueDict/unlockItem', item)
          }
        }
        /* if (data.watchedIntro) {
          this.$store.commit('canvasDict/setWatchedIntro')
        }
        if (data.gameState) {
          this.$store.commit('canvasDict/changeGameState', data.gameState)
        }
        if (data.mapOffset) {
          this.$store.commit('canvasDict/setMapOffset', data.mapOffset)
        }
        if (data.currentLevel) {
          this.$store.commit('canvasDict/setLevel', data.currentLevel)
        }
        if (data.currentBuilding) {
          this.$store.commit('canvasDict/setBuilding', data.currentBuilding)
        }
        if (data.character) {
          this.$store.commit('canvasDict/setCharacter', data.character)
        }
        if (data.unlockedBuildings) {
          this.$store.commit('canvasDict/changeUnlockedBuilding', data.unlockedBuildings)
        }
        if (data.collectables) {
          this.$store.commit('canvasDict/changeCollectables', data.collectables)
        }
        if (data.playerHealth) {
          this.$store.commit('canvasDict/setPlayerHealth', data.playerHealth)
        }
        if (data.dynamicLevelData) {
          this.$store.commit('canvasDict/changeDynamicLevelData', data.dynamicLevelData)
        } */
        if (data.updateSuccessful) {
          if (navigator.serviceWorker) {
            navigator.serviceWorker.getRegistration().then((registration) => {
              if (registration && registration.waiting) {
                this.$store.commit('updateSuccessful')
              } else {
                this.$store.commit('updateSuccess')
                window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
              }
            })
          }
        }

        if (data.version !== this.$store.state.version) {
          window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
        }
      }

      this.$store.dispatch('getEntries', { name: 'wordpackdb', store: 'wordPacks' })
    },
    toggleTransitionActive (bool) {
      this.$store.commit('vueDict/changeTransitionActive', bool)
    }
  },
  watch: {
    '$route' (to, from) {
      this.enterTransition = 'animate__animated ' +
        (from.meta.forward.includes(to.name) ? 'animate__slideInRight' : 'animate__slideInLeft') +
        ' duration-c-500ms delay-c-100ms'
      this.leaveTransition = 'animate__animated ' +
        (from.meta.forward.includes(to.name) ? 'animate__slideOutLeft' : 'animate__slideOutRight') +
        ' duration-c-500ms'
    }
  }
}
</script>

<style lang="scss" src="@/assets/custom.scss"></style>
