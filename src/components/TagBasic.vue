<template>
  <div class="tags has-addons">
    <span class="tag" :class="[colorOne, getSizeClass('tag')]" @click="$emit('click')">
      {{ getText(textOne) }}
    </span>
    <span class="tag" :class="[colorTwo, getSizeClass('tag')]" @click="$emit('click')">
      {{ getText(textTwo) }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'TagBasic',
  props: {
    colorOne: String,
    textOne: String,
    colorTwo: String,
    textTwo: [String, Number]
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
