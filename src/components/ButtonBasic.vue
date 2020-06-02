<template>
  <button class="button is-rounded is-fullwidth"
          :class="[getSizeClass('button'), color, { 'is-outlined': !selected }]" @click="$emit('click')">
    <span class="icon">
      <font-awesome-icon :icon="['fas', icon]" />
    </span>
    <span>{{ getText(text) }}</span>
  </button>
</template>

<script>
export default {
  name: 'ButtonBasic',
  props: {
    icon: String,
    text: String,
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
