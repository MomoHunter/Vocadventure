<template>
  <div id="app">
    <TheStatus></TheStatus>
    <div class="page">
      <transition name="slide">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>
import Store from '@/store/index.js'
import TheStatus from '@/components/TheStatus.vue'

export default {
  name: 'app',
  store: Store,
  components: {
    TheStatus
  }
}
</script>

<style lang="scss" src="@/sass/bulma.scss">
</style>
