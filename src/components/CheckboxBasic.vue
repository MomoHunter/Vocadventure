<template>
  <div class="checkbox flex-column" :class="getSizeClass('general')">
    <div class="title">
      {{ getText(title) }}
    </div>
    <div class="relative">
      <span class="icon">
        <i class="fas" :class="'fa-' + icon"></i>
      </span>
      <div class="text">
        {{ getText(text) }}
      </div>
      <span class="check" @click="$emit('click')">
        <div class="body" :class="[triggerColor, triggerState]">
          <div class="head">
            <i class="fas" :class="'fa-' + headIcon"></i>
          </div>
        </div>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckboxBasic',
  props: {
    title: String,
    icon: String,
    text: String,
    active: Boolean
  },
  computed: {
    triggerColor () {
      return this.active ? 'green-dark' : 'red-dark'
    },
    triggerState () {
      return this.active ? 'on' : 'off'
    },
    headIcon () {
      return this.active ? 'check' : 'times'
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
