<template>
  <nav class="level is-mobile">
    <div class="level-item has-text-centered" v-for="statusItem in status" :key="statusItem.id">
      <div>
        <p class="heading">{{ getText(statusItem.id) }}</p>
        <p class="title">{{ statusItem.count }}</p>
      </div>
    </div>
  </nav>
</template>

<script>
import Texts from './../data/Texts'

export default {
  name: 'TheStatus',
  props: ['status'],
  methods: {
    getText: function (id) {
      return Texts['Deutsch'][id]
    }
  }
}
</script>
