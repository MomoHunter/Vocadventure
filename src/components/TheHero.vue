<template>
  <section class="hero">
    <div class="hero-body">
      <div class="container">
        <h1 class="title" v-bind:class="gD.getSizeClass('title')">{{ gD.getText(title) }}</h1>
        <h2 class="subtitle" v-bind:class="gD.getSizeClass('subtitle')">{{ gD.getText(subtitle) }}</h2>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TheHero',
  props: ['gD', 'title', 'subtitle']
}
</script>

<style lang="scss">

</style>
