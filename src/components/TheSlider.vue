<template>
  <div class="slider flex-column" :class="getSizeClass('general')">
    <div class="title">
      {{ getText(title) }}
    </div>
    <div class="flex-row">
      <div class="icon flex-row">
        <i class="fas" :class="'fa-' + icon"></i>
      </div>
      <input class="input-slider flex-grow" type="range" :min="min" :max="max" :step="step" :value="value"
             @input="sendNewValue($event.target.value)">
      <div class="value text-center">
        {{ transformedValue }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheSlider',
  props: {
    title: String,
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
  computed: {
    transformedValue () {
      if (parseInt(this.step) === this.step) {
        return this.value
      } else {
        return this.value.toFixed(2)
      }
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
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
