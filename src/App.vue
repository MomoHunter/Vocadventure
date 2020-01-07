<template>
  <div id="app">
    <TheStatus></TheStatus>
    <div class="page">
      <transition :enter-active-class="enterTransition" :leave-active-class="leaveTransition">
        <router-view></router-view>
      </transition>
    </div>
    <TheModal :show="$store.state.showModal" />
  </div>
</template>

<script>
import Store from '@/store/index.js'
import TheStatus from '@/components/TheStatus.vue'
import TheModal from '@/components/TheModal.vue'

export default {
  name: 'app',
  store: Store,
  components: {
    TheStatus,
    TheModal
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

      if (data) {
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
          this.$store.commit('changeStatus', data.status)
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
