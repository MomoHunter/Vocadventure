<template>
  <div class="flexContainer">
    <HeroBasic :title="chosenWord" />
  </div>
</template>

<script>
export default {
  name: 'TheWriteKanji'
}
</script>

<style lang="scss" scoped>
.flexContainer {
  display: flex;
  flex-direction: column;
}
</style>
