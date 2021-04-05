<template>
  <div class="modal width-full height-full flex-column">
    <img src="@/assets/rusure.gif" alt="Are you sure?">
    <div class="flex-row">
      <ButtonBasic class="single-2 flex-grow" color="red" icon="times" text="modalButton1"
                   @click="$store.commit('vueDict/closeModal')" />
      <ButtonBasic class="single-2 flex-grow" color="green" icon="check" text="modalButton2" @click="deleteData()" />
    </div>
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheModal',
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
.modal {
  justify-content: center;
  max-width: 700px;
}
</style>
