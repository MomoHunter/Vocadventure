<template>
  <button class="button is-rounded is-outlined is-fullwidth" :class="[getSizeClass('button'), color]"
     @click="$emit('click')">
    <span class="icon">
      <font-awesome-icon :icon="['fas', icon]" />
    </span>
  </button>
</template>

<script>
export default {
  name: 'ButtonIcon',
  props: ['icon', 'color'],
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>
