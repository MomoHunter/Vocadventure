<template>
  <div id="app">
    <TheStatus :gD="globalDict"></TheStatus>
    <div class="page">
      <transition name="slide">
        <router-view/>
      </transition>
    </div>
  </div>
</template>

<script>
import Texts from '@/data/Texts.json'
import SizeClasses from '@/data/SizeClasses.json'
import TheStatus from '@/components/TheStatus.vue'

export default {
  name: 'app',
  components: {
    TheStatus
  },
  data: function () {
    return {
      globalDict: {
        lang: 'Deutsch',
        status: [
          { id: 'points', count: 0 },
          { id: 'steps', count: 0 },
          { id: 'coins', count: 0 }
        ],
        getText: function (id) {
          return Texts[this.lang][id]
        },
        getSizeClass: function (type) {
          return SizeClasses[type][this.size]
        }
      }
    }
  }
}
</script>

<style lang="scss" src="@/sass/bulma.scss">
.page {
  width: 100%;
  height: calc(100% - 147px);
}
</style>
