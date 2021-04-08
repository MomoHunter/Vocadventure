<template>
  <div class="input-text icons flex-column" :class="[getSizeClass('general'), color]" @click="$emit('click')">
    <div v-if="hasTitle" class="title">
      {{ getText(title) }}
    </div>
    <div class="flex-row">
      <span class="icon" :class="colorLeft">
        <i v-show="leftIconVisible" class="fas" :class="'fa-' + iconLeft"></i>
      </span>
      <input class="input width-full" :type="type" @input="$emit('input', $event.target.value)" :value="value"
            :maxlength="maxLength" :readonly="readonly" />
      <span class="icon" :class="colorRight">
        <i v-show="rightIconVisible" class="fas" :class="'fa-' + iconRight"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputTwoIcons',
  props: {
    title: String,
    type: String,
    color: String,
    colorLeft: String,
    colorRight: String,
    iconLeft: {
      type: String,
      default: 'times'
    },
    iconRight: {
      type: String,
      default: 'times'
    },
    leftIconVisible: Boolean,
    rightIconVisible: Boolean,
    maxLength: Number,
    value: String,
    readonly: Boolean
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
