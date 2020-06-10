<template>
  <nav class="level is-mobile">
    <div class="level-item has-text-centered" v-for="state in status" :key="state.id">
      <div>
        <p class="heading">{{ getText(state.id) }}</p>
        <p class="title">
          {{ state.count.toLocaleString() }}
          <span v-show="inAdventure" class="has-text-success">
            +{{ state.additional.toLocaleString() }}
          </span>
        </p>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TheStatus',
  props: {
    status: Array
  },
  computed: {
    inAdventure () {
      return this.$route.name.startsWith('adventure')
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    }
  }
}
</script>

<style scoped>
nav {
  margin-top: 0.5rem;
}
</style>
