<template>
  <div class="section-title flex-row" :class="[getSizeClass('general'), color, { 'no-icons': !hasFAIcon && !hasMDIcon }]">
    <div v-if="hasFAIcon" class="icon">
      <font-awesome-icon :icon="['fas', icon]" />
    </div>
    <div v-if="hasMDIcon" class="icon">
      <slot></slot>
    </div>
    <div class="text">
      {{ getText(text) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TitleBasic',
  props: {
    text: String,
    color: String,
    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    hasFAIcon () {
      return this.icon !== ''
    },
    hasMDIcon () {
      return this.$slots.hasOwnProperty('default')
    }
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
