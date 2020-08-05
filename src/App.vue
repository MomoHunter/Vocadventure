<template>
  <div id="app">
    <TheStatus class="statusMargin" :status="$store.state.vueDict.status"></TheStatus>
    <div class="page">
      <transition :enter-active-class="enterTransition" :leave-active-class="leaveTransition"
                  @after-enter="toggleTransitionActive(true)" @before-enter="toggleTransitionActive(false)">
        <router-view></router-view>
      </transition>
    </div>
    <ModalAreYouSure :show="$store.state.vueDict.showModals.name === 'areYouSure'" />
    <ModalMessage :show="$store.state.vueDict.showModals.name === 'message'" :options="$store.state.vueDict.showModals"
                  @click="$store.commit('vueDict/modalAnswer', $event)" />
  </div>
</template>

<script>
import Store from '@/store/index.js'
import TheStatus from '@/components/TheStatus.vue'
import ModalAreYouSure from '@/components/ModalAreYouSure.vue'
import ModalMessage from '@/components/ModalMessage.vue'

export default {
  name: 'app',
  store: Store,
  components: {
    TheStatus,
    ModalAreYouSure,
    ModalMessage
  },
  mounted () {
    let viewport = document.querySelector('[name~=viewport][content]')

    if (window.screen.width * window.devicePixelRatio < 1150) {
      viewport.content = 'width=device-width, initial-scale=0.75'
    }

    this.loadData()
    this.$store.commit('canvasDict/setSpritesheet')
  },
  data () {
    return {
      enterTransition: '',
      leaveTransition: ''
    }
  },
  methods: {
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
        if (data.status) {
          this.$store.commit('vueDict/changeStatus', data.status)
        }
        if (data.categoriesPlayed) {
          this.$store.commit('vueDict/changeCategoriesPlayed', data.categoriesPlayed)
        }
        if (data.inventory) {
          this.$store.commit('vueDict/changeInventory', data.inventory)
        }
        if (data.unlockedItems) {
          for (let item of data.unlockedItems) {
            this.$store.commit('vueDict/unlockItem', item)
          }
        }
        if (data.watchedIntro) {
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
        }

        if (data.version !== this.$store.state.version) {
          window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
        }
      }
    },
    toggleTransitionActive (bool) {
      this.$store.commit('vueDict/changeTransitionActive', bool)
    }
  },
  watch: {
    '$route' (to, from) {
      this.enterTransition = 'animated ' +
        (from.meta.forward.includes(to.name) ? 'slideInRight' : 'slideInLeft') +
        ' faster delay-100ms'
      this.leaveTransition = 'animated ' +
        (from.meta.forward.includes(to.name) ? 'slideOutLeft' : 'slideOutRight') +
        ' faster'
    }
  }
}
</script>

<style lang="scss" src="@/assets/custom.scss"></style>

<style lang="scss" scoped>
.statusMargin {
  margin-top: 5px;
}
</style>
