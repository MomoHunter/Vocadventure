<template>
  <button class="button is-rounded is-outlined is-fullwidth" :class="[getSizeClass('button'), color]"
          @click="$emit('click')">
    <span class="icon">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'ButtonMDIIcon',
  props: ['color'],
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>
