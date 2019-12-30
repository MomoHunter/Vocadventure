<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title" v-bind:class="getSizeClass('title')">{{ getText(title) }}</h1>
        <h2 class="subtitle" v-bind:class="getSizeClass('subtitle')">{{ getText(subtitle) }}</h2>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TheHero',
  props: ['title', 'subtitle'],
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
