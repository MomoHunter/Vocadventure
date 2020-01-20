<template>
  <div class="tags has-addons">
    <span class="tag" :class="[colorOne, getSizeClass('tag')]" @click="$emit('click')">
      {{ getText(textOne) }}
    </span>
    <a class="tag is-delete" :class="[colorDelete, getSizeClass('tag')]" @click="$emit('click')"></a>
  </div>
</template>

<script>
export default {
  name: 'TagWithDelete',
  props: {
    colorOne: String,
    textOne: String,
    colorDelete: String
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
