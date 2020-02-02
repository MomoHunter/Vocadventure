<template>
  <button class="button is-rounded" @click="$emit('click')"
          :class="[getSizeClass('button'), color, { 'is-outlined': !selected }]">
    {{ getText(text) }}
  </button>
</template>

<script>
export default {
  name: 'ButtonText',
  props: {
    text: [String, Number],
    color: String,
    selected: Boolean
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
