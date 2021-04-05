<template>
  <div class="dropdown special" :class="[getSizeClass('general'), color]" @click="$emit('dropdown')">
    <div class="relative">
      <span class="icon">
        <font-awesome-icon :icon="['fas', icon]" />
      </span>
      <div class="trigger">
        {{ getText(label) }}
      </div>
      <span class="arrow">
        <font-awesome-icon :icon="['fas', buttonIcon]" />
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownButton',
  props: {
    color: String,
    icon: String,
    label: String,
    dropdownVisible: Boolean
  },
  computed: {
    buttonIcon () {
      return this.dropdownVisible ? 'angle-up' : 'angle-down'
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
