<template>
  <button class="button is-rounded" @click="$emit('click')"
          :class="[getSizeClass('button'), color, { 'is-outlined': !selected }]">
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'ButtonTextNoTranslation',
  props: {
    text: [String, Number],
    color: String,
    selected: Boolean
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>
