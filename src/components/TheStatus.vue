<template>
  <nav class="level is-mobile">
    <div class="level-item has-text-centered" v-for="status in gD.status" :key="status.id">
      <div>
        <p class="heading">{{ gD.getText(status.id) }}</p>
        <p class="title">{{ status.count }}</p>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'TheStatus',
  props: ['gD']
}
</script>
