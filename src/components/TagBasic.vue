<template>
  <div class="tags has-addons">
    <span class="tag" :class="[colorOne, getSizeClass('tag')]">{{ getText(textOne) }}</span>
    <span v-if="textTwo" class="tag" :class="[colorTwo, getSizeClass('tag')]">{{ getText(textTwo) }}</span>
    <a v-if="hasDelete" class="tag is-delete" :class="[colorDelete, getSizeClass('tag')]" @click="$emit('click')"></a>
  </div>
</template>

<script>
export default {
  name: 'TagBasic',
  props: {
    colorOne: String,
    textOne: String,
    colorTwo: String,
    textTwo: String,
    colorDelete: String,
    hasDelete: Boolean
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
