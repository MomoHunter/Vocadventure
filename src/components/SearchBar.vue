<template>
  <div class="field has-addons">
    <div class="control">
      <input class="input is-rounded" :class="[colorInput, getSizeClass('input')]" :type="type"
            @change="$emit('change', $event.target.value)" />
    </div>
    <div class="control">
      <ButtonIcon :icon="icon" :color="colorButton" @click="$emit('click')" />
    </div>
  </div>
</template>

<script>
import ButtonIcon from '@/components/ButtonIcon.vue'

export default {
  name: 'SearchBar',
  props: ['colorInput', 'colorButton', 'type', 'icon'],
  components: {
    ButtonIcon
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>

<style scoped>

</style>
