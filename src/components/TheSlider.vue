<template>
  <div class="box sliderBox">
    <div class="icon customIcon">
      <font-awesome-icon :icon="['fas', icon]" :size="getSizeClass('fas-special')" />
    </div>
    <input class="flexGrow slider" type="range" :min="min" :max="max" :step="step" :value="value"
           @input="sendNewValue($event.target.value)">
    <div class="box valueBox is-dark" v-if="!inputVisible" @click="showInput()">
      {{ value }}
    </div>
    <input v-focus class="input inputWidth" type="number" v-else :value="value" @blur="hideInput()"
           @input="sendNewValue($event.target.value)">
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
  data () {
    return {
      inputVisible: false
    }
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    showInput () {
      this.inputVisible = true
    },
    hideInput () {
      this.inputVisible = false
    },
    sendNewValue (newValue) {
      if (newValue <= this.max && newValue >= this.min) {
        this.$emit('input', parseFloat(newValue))
      }
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

  .inputWidth {
    width: 20%;
    margin-left: .5rem;
  }
}
</style>
