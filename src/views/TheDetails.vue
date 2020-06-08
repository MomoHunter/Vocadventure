<template>
  <div class="flexContainer">
    <HeroWithTags class="marginBottomSmall" :title="item.id" :tagObjects="tags" />
    <div class="box is-10 flexGrow">
      <div class="fullWidth fullHeight backgroundPicture" :style="{ backgroundImage: 'url(' + baseUrl + item.spritePath + ')' }">
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
import HeroWithTags from '@/components/HeroWithTags.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheDetails',
  components: {
    HeroWithTags,
    ButtonBasic
  },
  computed: {
    item () {
      return this.$store.getters['vueDict/getItemObject'](this.$route.params.item)
    },
    tags () {
      let quantity = this.$store.getters['vueDict/getInventoryObject'](this.$route.params.item)
      if (!quantity) {
        quantity = 0
      } else {
        quantity = quantity.quantity
      }
      return [
        {
          nameId: 'detailsTagOwn',
          valueId: quantity,
          color: 'is-info'
        }
      ]
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
        let itemData = this.$store.getters['vueDict/getItemObject'](this.item.id)

        this.item.costs.forEach(entry => {
          if (entry.id === 'coins') {
            this.$store.commit('vueDict/addStat', { id: entry.id, quantity: -entry.quantity })
          } else {
            this.$store.commit('vueDict/addToInventory', { id: entry.id, quantity: -entry.quantity })
          }
        }, this)

        if (this.item.output) {
          let max = this.item.output.reduce((acc, value) => { return acc + value.chance }, 0)
          let random = max * Math.random()

          for (let output of this.item.output) {
            random -= output.chance
            if (random <= 0) {
              itemData = this.$store.getters['vueDict/getItemObject'](output.id)
              break
            }
          }
        }

        this.$store.commit('vueDict/addToInventory', {
          id: itemData.id,
          quantity: itemData.quantity,
          item: {
            id: itemData.id,
            quantity: itemData.quantity,
            spritePath: itemData.spritePath,
            power: itemData.power || null,
            usefulAgainst: itemData.usefulAgainst || null,
            durability: itemData.durability || null,
            maxDurability: itemData.durability || null
          }
        })
        this.$store.commit('vueDict/unlockItem', itemData.id)
        this.$store.commit('vueDict/addStat', { id: 'points', quantity: itemData.points })
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
