<template>
  <div class="control">
    <input class="input is-rounded" :class="[color, getSizeClass('input')]" :type="type" :value="value" readonly />
    <span v-if="icon" class="icon is-left">
      <font-awesome-icon :icon="['fas', icon]" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'InputReadonly',
  props: {
    color: String,
    type: String,
    value: String,
    icon: String
  },
  methods: {
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>
