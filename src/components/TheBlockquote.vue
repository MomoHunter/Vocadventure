<template>
  <div class="blockquote" :class="getSizeClass('general')">
    <div class="bar"></div>
    <div v-if="!inHtml" class="text">
      {{ getText(text) }}
    </div>
    <div v-else class="text" v-html="getText(text)">
    </div>
  </div>
</template>

<script>
export default {
  name: 'TheBlockquote',
  props: {
    text: String,
    inHtml: Boolean
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
