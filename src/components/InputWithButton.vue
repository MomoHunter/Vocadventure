<template>
  <div class="field has-addons">
    <div class="control is-expanded" :class="{ 'has-icons-left': hasIconLeft }">
      <input v-focus class="input is-rounded is-fullwidth" :class="[colorInput, getSizeClass('input')]" :type="type"
             @input="$emit('input', $event.target.value)" :value="value" />
      <span v-if="hasIconLeft" class="icon is-left" :class="getSizeClass('icon')">
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
  props: {
    colorInput: String,
    colorButton: String,
    type: String,
    iconInput: String,
    iconButton: String,
    value: String
  },
  components: {
    ButtonIcon
  },
  computed: {
    hasIconLeft () {
      return this.iconInput !== undefined
    }
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>
