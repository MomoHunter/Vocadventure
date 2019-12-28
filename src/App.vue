<template>
  <div id="app">
    <TheStatus :status="status"></TheStatus>
  </div>
</template>

<script>
import TheStatus from './components/TheStatus'

export default {
  name: 'app',
  components: {
    TheStatus
  },
  data: function () {
    return {
      status: [
        { id: 'points', count: 0 },
        { id: 'steps', count: 0 },
        { id: 'coins', count: 0 }
      ]
    }
  }
}
</script>

<style>
@import "~bulma/css/bulma.min.css";
</style>
