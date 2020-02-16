<template>
  <div class="flexContainer">
    <HeroBasic class="marginBottomSmall" :title="item.id" />
    <div class="box is-10 flexGrow">
      <div class="fullWidth fullHeight backgroundPicture" :style="{ backgroundImage: 'url(' + baseUrl + item.spriteKey + ')' }">
      </div>
    </div>
    <table class="table is-10">
      <thead>
        <tr>
          <td class="has-background-primary">{{ getText('detailsColumn1') }}</td>
          <td class="has-background-primary has-text-centered">{{ getText('detailsColumn2') }}</td>
          <td class="has-background-primary has-text-centered">{{ getText('detailsColumn3') }}</td>
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
    },
    baseUrl () {
      return process.env.BASE_URL
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    isEnough (costObject) {
      if (this.ownQuantity(costObject.id) >= costObject.quantity) {
        return 'has-text-success'
      }
      return 'has-text-danger'
    },
    ownQuantity (id) {
      if (id === 'coins') {
        return this.$store.getters['vueDict/getCoins'].count
      } else {
        let inventoryObject = this.$store.getters['vueDict/getInventoryObject'](id)
        if (inventoryObject) {
          return inventoryObject.quantity
        }
        return 0
      }
    },
    buy () {
      let buyable = true

      this.item.costs.forEach(entry => {
        if (this.ownQuantity(entry.id) < entry.quantity) {
          buyable = false
        }
      }, this)

      if (buyable) {
        this.item.costs.forEach(entry => {
          if (entry.id === 'coins') {
            this.$store.commit('vueDict/addStat', { id: entry.id, quantity: -entry.quantity })
          } else {
            this.$store.commit('vueDict/addToInventory', { id: entry.id, quantity: -entry.quantity })
          }
        }, this)

        this.$store.commit('vueDict/addToInventory', {
          id: this.item.id,
          quantity: this.item.quantity,
          item: {
            id: this.item.id,
            quantity: this.item.quantity,
            spriteKey: this.item.spriteKey,
            durability: this.item.durability || null,
            maxDurability: this.item.durability || null
          }
        })
        this.$store.commit('vueDict/addStat', { id: 'points', quantity: this.item.points })
        window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
      }
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
