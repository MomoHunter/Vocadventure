<template>
  <div class="box sliderBox">
    <div class="icon customIcon">
      <font-awesome-icon :icon="['fas', icon]" :size="getSizeClass('fas')" />
    </div>
    <input class="flexGrow slider" type="range" :min="min" :max="max" :step="step" :value="value"
           @input="$emit('input', parseFloat($event.target.value))">
    <div class="box valueBox is-dark">
      {{ value }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheSlider',
  props: {
    min: Number,
    max: Number,
    step: Number,
    value: Number,
    icon: String
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.sliderBox {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  padding: .5rem;

  .customIcon {
    margin-right: .5rem;
  }

  .flexGrow {
    flex-grow: 1;
  }

  .valueBox {
    padding: .25rem;
    min-width: 40px;
    text-align: center;
    margin-left: .5rem;
  }
}
</style>
