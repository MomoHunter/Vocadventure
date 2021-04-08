<template>
  <div class="input-text flex-column" :class="[getSizeClass('general'), color]">
    <div v-if="hasTitle" class="title">
      {{ getText(title) }}
    </div>
    <div class="flex-row">
      <span class="icon">
        <i class="fas" :class="'fa-' + icon"></i>
      </span>
      <input v-focus class="input width-full" :type="type" @input="$emit('input', $event.target.value)" :value="value"
             :maxlength="maxlength" :readonly="readonly" :nofocus="noFocus" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputBasic',
  props: {
    title: {
      type: String,
      default: ''
    },
    type: String,
    icon: String,
    readonly: Boolean,
    noFocus: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: 9999
    },
    color: String,
    value: String
  },
  computed: {
    hasTitle () {
      return this.title !== ''
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

<style lang="scss" scoped>
.input-text {
  justify-content: center;
}
</style>
