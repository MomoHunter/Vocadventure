<template>
  <div class="modal is-active" v-if="show">
    <div class="modal-background"></div>
    <div class="modal-content is-clipped">
      <p class="image is-4by3">
        <img src="@/assets/rusure.gif" alt="Are you sure?">
      </p>
      <div class="flexContainer">
        <div class="is-10">
          <ButtonBasic class="marginBottomSmall" color="is-success" icon="check" text="modalButton1"
                      @click="deleteData()" />
          <ButtonBasic color="is-danger" icon="times" text="modalButton2"
                      @click="$store.commit('closeModal')" />
        </div>
      </div>
    </div>
    <button class="modal-close" :class="getSizeClass('button')" @click="$store.commit('closeModal')" />
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheModal',
  props: ['show'],
  components: {
    ButtonBasic
  },
  methods: {
    getSizeClass (type) {
      this.$store.getters.getSizeClass(type)
    },
    deleteData () {
      window.localStorage.removeItem('globalDict')
      this.$router.push({ name: 'menu' })
      location.reload()
    }
  }
}
</script>

<style lang="scss" scoped>
.flexContainer {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;

  .is-10 {
    width: calc(100% / 1.2);
  }
}
</style>
