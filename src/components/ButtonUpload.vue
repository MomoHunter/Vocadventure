<template>
  <div class="button upload" :class="[getSizeClass('general'), color]">
    <input class="input" type="file" accept=".json" multiple @change="$emit('change', $event.target.files)">
    <span class="icon">
      <font-awesome-icon :icon="['fas', icon]" />
    </span>
    <span class="text">
      {{ getText(text) }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'ButtonUpload',
  props: {
    icon: String,
    text: String,
    color: String
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

<style lang="scss" scoped>
.button {
  justify-content: center;
  align-items: center;
}
</style>
