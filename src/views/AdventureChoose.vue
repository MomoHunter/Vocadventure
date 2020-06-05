<template>
  <div class="flexboxContainer is-10">
    <div class="content marginTopMiddle has-text-centered" :class="getSizeClass('content')"
         v-html="getText($store.state.canvasDict.questionKey)"></div>
    <div>
      <ButtonBasic class="marginBottomSmall" icon="check" text="adventureChooseButton1" color="is-success"
                  @click="$emit('click', { type: 'chooseYes' })" />
      <ButtonBasic icon="times" text="adventureChooseButton2" color="is-danger"
                  @click="$emit('click', { type: 'chooseNo' })" />
    </div>
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'AdventureChoose',
  components: {
    ButtonBasic
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
.flexboxContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding-bottom: 71px;

  &.is-10 {
    width: calc(100% / 1.2);
  }
}
</style>
