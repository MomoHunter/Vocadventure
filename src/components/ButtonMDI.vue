<template>
  <button class="button is-rounded is-fullwidth" @click="$emit('click')"
          :class="[getSizeClass('button'), color, { 'is-outlined': !selected }]">
    <span class="icon">
      <slot></slot>
    </span>
    <span>{{ getText(text) }}</span>
  </button>
</template>

<script>
export default {
  name: 'ButtonMDI',
  props: ['color', 'text', 'selected'],
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
