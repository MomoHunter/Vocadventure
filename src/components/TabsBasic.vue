<template>
  <div class="tabs is-toggle is-fullwidth" :class="getSizeClass('tabs')">
    <ul>
      <li :class="currentlyActive(name)" v-for="name in names" :key="name">
        <a :class="{ 'is-radiusless': radiusless }" @click="$emit('click', name)">
          <span>{{ getText(name) }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TabsBasic',
  props: {
    names: Array,
    selected: String,
    radiusless: Boolean
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    currentlyActive (id) {
      if (this.selected === id) {
        return 'is-active'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
