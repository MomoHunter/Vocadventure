<template>
  <a class="button is-rounded is-outlined is-fullwidth" :class="[getSizeClass('button'), color]"
     @click="$emit('click')">
    <span class="icon">
      <font-awesome-icon :icon="['fas', icon]" />
    </span>
    <span>{{ getText(text) }}</span>
  </a>
</template>

<script>
export default {
  name: 'ButtonBasic',
  props: ['icon', 'text', 'color'],
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
