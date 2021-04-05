<template>
  <div class="page">
    <HeroBasic class="margin-bottom-small" title="notFoundTitle" :subtitle="['notFoundSubtitle']" />
    <ButtonBasic class="single-2 width-full" color="green" icon="home" text="notFoundButton" @click="navTo()" />
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheNotFound',
  components: {
    HeroBasic,
    ButtonBasic
  },
  methods: {
    navTo () {
      this.$router.push({ name: 'menu' })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  justify-content: center;
}
</style>
