<template>
  <section :class="theme.hero">
    <div :class="theme['hero-body']">
      <div :class="theme.container">
        <h1 :class="[getSizeClass('title'), theme.title]">{{ getText(title) }}</h1>
        <h2 :class="[getSizeClass('subtitle'), theme.subtitle]" v-if="showSubtitle">{{ getText(subtitle) }}</h2>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TheHero',
  props: ['title', 'subtitle'],
  computed: {
    showSubtitle () {
      return this.getText(this.subtitle)
    },
    theme () {
      return this.$store.getters.theme
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>

<style scoped>
h1, h2 {
  text-align: center;
}

section {
  width: 100%;
}
</style>
