<template>
  <section class="hero flex-column" :class="getSizeClass('general')">
    <span class="title text-center">
      {{ getText(title) }}
    </span>
    <span class="subtitle text-center" v-if="subtitle">
      {{ getText(...subtitle) }}
    </span>
  </section>
</template>

<script>
export default {
  name: 'HeroBasic',
  props: {
    title: String,
    subtitle: Array
  },
  methods: {
    getText (id, ...params) {
      return this.$store.getters.getText(id, ...params)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.hero {
  align-items: center;
  justify-content: center;
}
</style>
