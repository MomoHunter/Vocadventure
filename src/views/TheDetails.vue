<template>
  <div class="flexContainer">
    <HeroBasic class="marginBottomSmall" :title="item.id" />
    <div class="box is-10 flexGrow">
      <div class="fullWidth fullHeight backgroundPicture" :style="{ backgroundImage: 'url(../' + item.spriteKey + ')' }">
      </div>
    </div>
    <table class="table is-10">
      <thead>
        <tr>
          <td>{{ getText('detailsColumn1') }}</td>
          <td class="has-text-centered">{{ getText('detailsColumn2') }}</td>
          <td class="has-text-centered">{{ getText('detailsColumn3') }}</td>
        </tr>
      </thead>
      <tr v-for="cost in item.costs" :key="cost.id">
        <td>{{ getText(cost.id) }}</td>
        <td class="has-text-centered" :class="isEnough(cost)">{{ ownQuantity(cost.id) }}</td>
        <td class="has-text-centered">{{ cost.quantity }}</td>
      </tr>
    </table>
    <div class="is-10">
      <ButtonBasic class="marginBottomSmall" icon="coins" text="detailsButton1" color="is-success" @click="buy()" />
      <ButtonBasic icon="arrow-left" text="detailsButton2" color="is-danger" @click="$router.push({ name: 'shop' })" />
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheDetails',
  components: {
    HeroBasic,
    ButtonBasic
  },
  computed: {
    item () {
      return this.$store.getters['vueDict/getItemObject'](this.$route.params.item)
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    isEnough (costObject) {
      let inventoryObject = this.$store.getters['vueDict/getInventoryObject'](costObject.id)
      if (inventoryObject) {
        if (inventoryObject.quantity >= costObject.quantity) {
          return 'has-background-success'
        }
      }
      return 'has-background-danger'
    },
    ownQuantity (id) {
      let inventoryObject = this.$store.getters['vueDict/getInventoryObject'](id)
      if (inventoryObject) {
        return inventoryObject.quantity
      }
      return 0
    },
    buy () {

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
  flex-wrap: wrap;
  align-items: center;
  height: calc(100% - 71px);

  .is-10 {
    width: calc(100% / 1.2);
  }

  .flexGrow {
    flex-grow: 1;
  }

  .backgroundPicture {
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }
}
</style>
