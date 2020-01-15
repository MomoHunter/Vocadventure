<template>
  <div class="flexContainer spaceBetween">
    <TheHero title="trainingTitle" />
    <div class="box is-10">
      <div class="content has-text-centered" :class="getSizeClass('content')">
        {{ currentWord }}
      </div>
    </div>
    <TheProgressBar class="is-10 marginBottomSmall" color="is-success" text="0 / 0" />
  </div>
</template>

<script>
import TheHero from '@/components/TheHero.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'

export default {
  name: 'TheTraining',
  components: {
    TheHero,
    TheProgressBar
  },
  data () {
    return {
      currentWord: 'Hallo'
    }
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.flexContainer {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  height: 100%;

  &.spaceBetween {
    justify-content: space-between;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }
}
</style>
