<template>
  <div id="app">
    <TheStatus class="statusMargin" :status="$store.state.vueDict.status"></TheStatus>
    <div class="page">
      <transition :enter-active-class="enterTransition" :leave-active-class="leaveTransition">
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
  },
  data () {
    return {
      enterTransition: '',
      leaveTransition: '',
      tmp: false
    }
  },
  methods: {
    loadData () {
      let data = JSON.parse(window.localStorage.getItem('globalDict'))

      if (data && data.version) {
        if (data.version === '0.1.0') {
          data.status.forEach(element => {
            element.additional = 0
          }, this)
        }

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

        if (data.version !== this.$store.state.version) {
          window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
        }
      }
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
