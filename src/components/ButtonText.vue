<template>
  <button class="button is-rounded is-outlined" :class="[getSizeClass('button'), color]" @click="$emit('click')">
    {{ getText(text) }}
  </button>
</template>

<script>
export default {
  name: 'ButtonText',
  props: ['text', 'color'],
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
