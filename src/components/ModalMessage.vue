<template>
  <div class="modal width-full height-full flex-column" :class="getSizeClass('general')">
    <div class="content">
      <div class="title">
        {{ getText(options.title) }}
      </div>
      <div class="text overflow-auto" v-html="getText(...options.text)"></div>
      <div class="buttons flex-row">
        <ButtonBasic class="width-full" v-for="(button, index) in options.buttons" :icon="button.icon"
                     :text="button.text" :color="button.color" :key="index"
                     @click="$emit('click', 'button' + (index + 1))" />
      </div>
    </div>
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'ModalMessage',
  components: {
    ButtonBasic
  },
  props: {
    options: Object
  },
  methods: {
    getText (id, ...params) {
      return this.$store.getters.getText(id, ...params)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  justify-content: center;
  max-width: 700px;
}
</style>
