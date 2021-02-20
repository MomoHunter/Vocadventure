<template>
  <div class="flexboxContainer">
    <div class="innerFlexContainerUpgrades is-10 flexGrow marginTopSmall">
      <ButtonBasic v-show="nextUpgradeData !== null" class="is-full marginBottomSmall" icon="angle-double-up"
                   color="is-primary" text="adventureHomeUpgradesButton1" @click="showUpgrades()" />
      <ButtonBasic v-show="nextUpgradeData === null" class="is-full marginBottomSmall" icon="times"
                   color="is-danger" text="adventureHomeUpgradesButton2" disabled />
      <ButtonIcon class="is-half marginRightSmall" :class="getInvisible(currentPoint.left)" icon="long-arrow-alt-left" color="is-link" @click="$emit('click', getClickObject(currentPoint.left))" />
      <ButtonIcon class="is-half marginLeftSmall" :class="getInvisible(currentPoint.right)" icon="long-arrow-alt-right" color="is-link" @click="$emit('click', getClickObject(currentPoint.right))" />
    </div>
    <div class="innerFlexContainerButton is-10">
      <ButtonBasic class="is-half marginBottomSmall marginRightSmall" icon="map" color="is-warning"
                   text="adventureHomeButton1" @click="$emit('click', { type: 'backToMap' })" />
      <ButtonBasic class="is-half marginBottomSmall marginLeftSmall" icon="arrow-right" color="is-success"
                   text="adventureHomeButton2" :disabled="disabledEntry" />
      <ButtonBasic class="is-full" icon="times" color="is-danger" text="adventureHomeButton3"
                   @click="$emit('click', { type: 'abort' })" />
    </div>
    <transition enter-active-class="animated fadeInUp a-little-bit-faster"
                leave-active-class="animated fadeOutDown a-little-bit-faster">
      <div v-show="upgradesVisible" class="upgradesContainer has-background-background">
        <h1 class="title marginTopBig" :class="getSizeClass('title')">
          {{ getText(nextUpgradeData.id) }}
        </h1>
        <div class="box imageBox">
          <div class="fullHeight fullWidth backgroundPicture"
               :style="{ backgroundImage: 'url(' + baseUrl + nextUpgradeData.spritePath + ')' }"></div>
        </div>
        <div class="is-10 flexGrow overflowAuto marginBottomBig">
          <h2 class="subtitle has-text-weight-bold marginBottomSmall" :class="getSizeClass('subtitle')">
            {{ getText('adventureHomeUpgradesUnlocks') }}
          </h2>
          <div class="content" :class="getSizeClass('content')">
            <ul>
              <li v-for="(id, index) in nextUpgradeData.gains" :key="index">
                {{ getText(id) }}
              </li>
            </ul>
          </div>
          <table class="table fullWidth">
            <thead>
              <tr class="headerSticky">
                <td class="has-background-primary" :class="getSizeClass('td')">{{ getText('adventureHomeColumn1') }}</td>
                <td class="has-background-primary has-text-centered" :class="getSizeClass('td')">{{ getText('adventureHomeColumn2') }}</td>
                <td class="has-background-primary has-text-centered" :class="getSizeClass('td')">{{ getText('adventureHomeColumn3') }}</td>
              </tr>
            </thead>
            <tr v-for="cost in nextUpgradeData.costs" :key="cost.id">
              <td :class="getSizeClass('td')">{{ getText(cost.id) }}</td>
              <td class="has-text-centered" :class="[isEnough(cost), getSizeClass('td')]">{{ ownQuantity(cost.id).toLocaleString() }}</td>
              <td class="has-text-centered" :class="getSizeClass('td')">{{ cost.quantity.toLocaleString() }}</td>
            </tr>
          </table>
        </div>
        <div class="is-10">
          <ButtonBasic class="marginBottomSmall" icon="coins" color="is-success" text="adventureHomeUpgradesButton3"
                       :disabled="disabledBuy" />
          <ButtonBasic icon="times" color="is-danger" text="adventureHomeUpgradesButton4" @click="hideUpgrades()" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

export default {
  name: 'AdventureHome',
  components: {
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
        return 'has-text-success'
      }
      return 'has-text-danger'
    },
    getInvisible (link) {
      if (!link || !this.$store.state.canvasDict.unlockedBuildings.includes(link)) {
        return 'invisible'
      }
      return ''
    },
    showUpgrades () {
      this.upgradesVisible = true
    },
    hideUpgrades () {
      this.upgradesVisible = false
    },
    buyUpgrade () {
      let buyable = true
      for (let cost of this.nextUpgradeData.costs) {
        if (cost.quantity > this.ownQuantity(cost.id)) {
          buyable = false
        }
      }

      if (buyable) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.flexboxContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  align-items: center;
  padding-bottom: 71px;

  .is-10 {
    width: calc(100% / 1.2);
  }

  .overflowAuto {
    overflow: auto;
  }

  .flexGrow {
    flex-grow: 1;
  }

  .innerFlexContainerUpgrades {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-content: flex-start;

    .is-half {
      width: calc(50% - .25rem);
    }

    .is-full {
      width: 100%;
    }

    .invisible {
      opacity: .2;
      pointer-events: none;
    }
  }

  .innerFlexContainerButton {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    .is-half {
      width: calc(50% - .25rem);
    }

    .is-full {
      width: 100%;
    }
  }

  .upgradesContainer {
    position: absolute;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    height: calc(100% + .5rem);
    padding-bottom: 71px;
    top: 0px;
    z-index: 4;

    .imageBox {
      padding: .5rem;
      width: 10em;
      height: 10em;

      .backgroundPicture {
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }

    .headerSticky td {
      position: sticky;
      top: 0px;
      z-index: 20;
    }

    .content ul {
      margin-top: 0;
    }

    .table tbody tr:last-child td {
      border-bottom-width: 1px !important;
    }
  }
}
</style>
