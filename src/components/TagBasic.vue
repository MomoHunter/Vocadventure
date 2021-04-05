<template>
  <div class="tag" :class="[getSizeClass('general'), color]">
    <div class="title">
      {{ getText(title) }}
    </div>
    <div class="text">
      {{ getText(text) }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'TagBasic',
  props: {
    title: String,
    text: [String, Number],
    color: String
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
