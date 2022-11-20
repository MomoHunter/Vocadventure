<template>
  <div class="modal width-full height-full flex-column">
    <img src="@/assets/rusure.gif" :alt="getText('modalAltAreYouSure')">
    <div class="flex-row">
      <ButtonBasic class="single-2 flex-grow" color="red" icon="times" text="modalButton1" @click="closeModal()" />
      <ButtonBasic class="single-2 flex-grow" color="green" icon="check" text="modalButton2" @click="deleteData()" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import ButtonBasic from '@/components/ButtonBasic.vue'

import { useSavestateStore } from '@/stores/savestate'
import { useAppConstStore } from '@/stores/appconst'
import { useAppDynStore } from '@/stores/appdyn'

const router = useRouter()
const savestate = useSavestateStore()
const appDyn = useAppDynStore()
const appConst = useAppConstStore()

function closeModal () {
  appDyn.activeModal = null
}

function deleteData () {
  savestate.deleteData()
  router.push({ name: 'menu' })
  setTimeout(() => location.reload(), 500)
}

function getText (id) {
  return appConst.getText(id)
}
</script>

<style lang="scss" scoped>
.modal {
  justify-content: center;
  max-width: 700px;
}
</style>
