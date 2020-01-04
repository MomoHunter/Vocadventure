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
  data () {
    return {
      enterTransition: '',
      leaveTransition: '',
      tmp: false
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
