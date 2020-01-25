<template>
  <section class="hero maxWidth">
    <div class="hero-body">
      <div class="container">
        <h1 class="title textCenter" :class="getSizeClass('title')">{{ getText(title) }}</h1>
        <h2 class="subtitle textCenter" :class="getSizeClass('subtitle')" v-if="showSubtitle">{{ getText(subtitle) }}</h2>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TheHero',
  props: {
    title: String,
    subtitle: String
  },
  computed: {
    showSubtitle () {
      return this.getText(this.subtitle)
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
.textCenter {
  text-align: center;
}

.maxWidth {
  width: 100%;
}
</style>
