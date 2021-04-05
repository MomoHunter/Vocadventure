<template>
  <div class="adventure-page">
    <HeroBasic class="mini" title="adventureHomeUpgradesButton1" :subtitle="[nextUpgradeData.id]" />
    <div class="upgrade flex-grow overflow-auto">
      <div class="shop-image width-full margin-bottom-medium" :class="getSizeClass('general')">
        <div class="image-box" :style="{ backgroundImage: 'url(' + baseUrl + nextUpgradeData.spritePath + ')' }"></div>
      </div>
      <TheBlockquote class="margin-bottom-medium" :text="gainText" inHtml />
      <div class="section-title" :class="getSizeClass('general')">
        {{ getText('adventureHomeUpgradesCostsTitle') }}
      </div>
      <div class="costs margin-bottom-medium" :class="getSizeClass('general')">
        <div class="entry flex-row" v-for="cost in nextUpgradeData.costs" :key="cost.id">
          <div class="image">
            <div class="image-box" :style="{ backgroundImage: 'url(' + baseUrl + getCostIcon(cost.id) + ')' }"></div>
          </div>
          <div class="material flex-grow">
            {{ getText(cost.id) }}
          </div>
          <div class="own" :class="isEnough(cost)">
            {{ formatValue(ownQuantity(cost.id)) }}
          </div>
          <div class="needed">
            {{ formatValue(cost.quantity) }}
          </div>
        </div>
      </div>
      <ButtonBasic class="single-2 width-full margin-bottom-small" icon="coins" color="green"
                   text="adventureHomeUpgradesButton3" @click="buyUpgrade()" :disabled="disabledBuy" />
    </div>
    <div class="button-container">
      <ButtonIcon class="width-half" icon="long-arrow-alt-left" color="action"
                  @click="$emit('click', getClickObject(currentPoint.left))"
                  :disabled="hasBuilding(currentPoint.left)" />
      <ButtonIcon class="width-half" icon="long-arrow-alt-right" color="action"
                  @click="$emit('click', getClickObject(currentPoint.right))"
                  :disabled="hasBuilding(currentPoint.right)" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="times" color="red" text="adventureHomeButton3"
                   @click="$emit('click', { type: 'abort' })" />
      <ButtonBasic class="width-half" icon="arrow-right" color="green" text="adventureHomeButton2"
                   :disabled="disabledEntry" />
      <ButtonBasic class="width-full" icon="map" color="yellow" text="adventureHomeButton1"
                   @click="$emit('click', { type: 'backToMap' })" />
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import TheBlockquote from '@/components/TheBlockquote.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

export default {
  name: 'AdventureHome',
  components: {
    HeroBasic,
    TheBlockquote,
    ButtonBasic,
    ButtonIcon
  },
  data () {
    return {
      upgradesVisible: false
    }
  },
  computed: {
    currentPoint () {
      return this.$store.getters['canvasDict/currentHomePoint']
    },
    nextUpgradeData () {
      return this.$store.getters['vueDict/getNextUpgradeObject'](
        this.$store.state.vueDict.currentUpgradeLevels[this.$store.state.canvasDict.currentBuilding]
      )
    },
    baseUrl () {
      return process.env.BASE_URL
    },
    collectedItems () {
      return this.$store.state.canvasDict.collectedItems
    },
    gainText () {
      return this.getText('adventureHomeUpgradesUnlocks') + '<br><ul>' + this.nextUpgradeData.gains.map(id => {
        return '<li>' + this.getText(id) + '</li>'
      }, this).join('') + '</ul>'
    },
    disabledEntry () {
      switch (this.$store.state.canvasDict.currentBuilding) {
        case 'house':
          if (this.$store.state.vueDict.currentUpgradeLevels.house === 'nohouse') {
            return true
          }
          break
        case 'launchpad':
          if (this.$store.state.vueDict.currentUpgradeLevels.launchpad === 'nolaunchpad') {
            return true
          }
          break
        case 'greenhouse':
          if (this.$store.state.vueDict.currentUpgradeLevels.greenhouse === 'nogreenhouse') {
            return true
          }
          break
        default:
      }
      return false
    },
    disabledBuy () {
      for (let costObject of this.nextUpgradeData.costs) {
        if (this.ownQuantity(costObject.id) < costObject.quantity) {
          return true
        }
      }
      return false
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (id) {
      return this.$store.getters.getSizeClass(id)
    },
    getClickObject (target) {
      return {
        type: 'navigateToHomePoint',
        value: target
      }
    },
    getCostIcon (itemId) {
      let itemData = this.$store.getters['vueDict/getItemObject'](itemId)
      if (itemData) {
        return itemData.spritePath
      } else if (itemId === 'coins') {
        return 'img/items/coin.png'
      }
      return ''
    },
    ownQuantity (id) {
      if (id === 'coins') {
        let coins = this.$store.getters['vueDict/getCoins']

        return coins.count + coins.additional
      } else {
        let inventoryObject = this.$store.getters['vueDict/getInventoryObject'](id)
        let collectedObject = this.collectedItems.find(item => item.id === id)

        return (inventoryObject ? inventoryObject.quantity : 0) + (collectedObject ? collectedObject.quantity : 0)
      }
    },
    isEnough (costObject) {
      if (this.ownQuantity(costObject.id) >= costObject.quantity) {
        return 'green'
      }
      return 'red'
    },
    hasBuilding (direction) {
      if (!direction || !this.$store.state.canvasDict.unlockedBuildings.includes(direction)) {
        return true
      }
      return false
    },
    buyUpgrade () {
      if (!this.disabledBuy) {
        for (let cost of this.nextUpgradeData.costs) {
          if (cost.id === 'coins') {
            this.$store.commit('vueDict/commitStat', {
              id: cost.id,
              quantity: -cost.quantity
            })
          } else {
            this.$store.commit('vueDict/addToInventory', {
              id: cost.id,
              quantity: -cost.quantity
            })
          }
        }

        this.$store.commit('vueDict/setCurrentUpgradeLevel', {
          currentBuilding: this.$store.state.canvasDict.currentBuilding,
          newValue: this.nextUpgradeData.id
        })
      }
    },
    formatValue (value) {
      if (value < 1_000_000) {
        return value.toLocaleString()
      } else if (value < 1_000_000_000) {
        return (value / 1_000_000).toFixed(3) + 'M'
      } else if (value < 1_000_000_000_000) {
        return (value / 1_000_000_000).toFixed(3) + 'B'
      } else {
        return (value / 1_000_000_000_000).toFixed(3) + 'T'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.upgrade {
  height: 1rem;
}
</style>
