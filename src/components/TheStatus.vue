<template>
  <nav class="level is-mobile">
    <div class="level-item has-text-centered" v-for="state in status" :key="state.id">
      <div>
        <p class="heading">{{ getText(state.id) }}</p>
        <p class="title">{{ state.count }}</p>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TheStatus',
  computed: {
    ...mapState([
      'status'
    ])
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    }
  }
}
</script>
