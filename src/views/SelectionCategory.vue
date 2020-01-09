<template>
  <div class="flexContainer">
    <TheHero :title="destination" />
    <div class="field has-addons is-10">
      <DropdownBasic :options="sorters" icon="sort" selected="sortStandard" color="is-link" />
      <div class="control">
        <ButtonBasic color="is-link" icon="filter" text="categoryButton1" />
      </div>
    </div>
    <div class="is-10 flexGrow">

    </div>
    <div class="is-10">
      <ButtonBasic class="marginBottomSmall" color="is-success" icon="check" text="categoryButton2"
                   @click="$router.push({ name: 'selection' })" />
      <ButtonBasic class="marginBottomSmall" color="is-danger" icon="arrow-left" text="categoryButton3"
                   @click="$router.push({ name: 'menu' })" />
    </div>
  </div>
</template>

<script>
import TheHero from '@/components/TheHero.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'SelectionCategory',
  components: {
    TheHero,
    DropdownBasic,
    ButtonBasic
  },
  computed: {
    destination () {
      return this.$route.params.destination
    },
    sorters () {
      return ['sortStandard']
    }
  }
}
</script>

<style lang="scss" scoped>
.flexContainer {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;

  .is-10 {
    width: calc(100% / 1.2);
  }

  .flexGrow {
    flex-grow: 1;
  }
}
</style>
