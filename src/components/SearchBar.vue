<template>
  <div class="field has-addons">
    <div class="control has-icons-left is-expanded">
      <input class="input is-rounded is-fullwidth" :class="[colorInput, getSizeClass('input')]" :type="type"
             @input="$emit('input', $event.target.value)" />
      <span class="icon is-left">
        <font-awesome-icon :icon="['fas', iconInput]" />
      </span>
    </div>
    <div class="control">
      <ButtonIcon :icon="iconButton" :color="colorButton" @click="$emit('click')" />
    </div>
  </div>
</template>

<script>
import ButtonIcon from '@/components/ButtonIcon.vue'

export default {
  name: 'SearchBar',
  props: ['colorInput', 'colorButton', 'type', 'iconInput', 'iconButton'],
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
