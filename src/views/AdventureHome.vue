<template>
  <div class="flexboxContainer">
    <div class="innerFlexContainerUpgrades is-10 flexGrow">
      <ButtonBasic class="is-full marginBottomSmall" icon="angle-double-up" color="is-primary" text="adventureHomeUpgradesButton1" @click="showUpgrades()" />
      <ButtonIcon class="is-half marginRightSmall" :class="getInvisible(currentPoint.left)" icon="long-arrow-alt-left" color="is-link" @click="$emit('click', getClickObject(currentPoint.left))" />
      <ButtonIcon class="is-half marginLeftSmall" :class="getInvisible(currentPoint.right)" icon="long-arrow-alt-right" color="is-link" @click="$emit('click', getClickObject(currentPoint.right))" />
    </div>
    <!-- <div ref="upgradeBox" class="box upgradeBox is-10">
      <article class="media fullHeight" v-if="nextUpgradeData !== null">
        <div class="media-left is-30 fullHeight is-flex is-column">
          <div class="box imageBox marginBottomSmall">
            <div class="fullHeight fullWidth backgroundPicture"
                :style="{ backgroundImage: 'url(' + baseUrl + nextUpgradeData.spritePath + ')' }"></div>
          </div>
          <ButtonBasic color="is-success" icon="coins" text="adventureHomeUpgradeBuy" @click="buyUpgrade()"
                       :disabled="disabledBuy" />
        </div>
        <div ref="table" class="media-content overflowAuto">
          <table class="table fullWidth narrow">
            <thead>
              <tr>
                <td class="has-background-primary">{{ getText('adventureHomeColumn1') }}</td>
                <td class="has-background-primary has-text-centered">{{ getText('adventureHomeColumn2') }}</td>
                <td class="has-background-primary has-text-centered">{{ getText('adventureHomeColumn3') }}</td>
              </tr>
            </thead>
            <tr v-for="cost in nextUpgradeData.costs" :key="cost.id">
              <td>{{ getText(cost.id) }}</td>
              <td class="has-text-centered" :class="isEnough(cost)">{{ ownQuantity(cost.id).toLocaleString() }}</td>
              <td class="has-text-centered">{{ cost.quantity.toLocaleString() }}</td>
            </tr>
          </table>
        </div>
      </article>
      <div class="content centered fullHeight" :class="getSizeClass('content')" v-else>
        {{ getText('adventureHomeNoUpgrade') }}
      </div>
    </div>
    <div ref="buttonBox1" class="innerFlexContainerNavigation is-10 marginBottomBig">
      <ButtonIcon class="is-half marginRightSmall" :class="getInvisible(currentPoint.left)"
                  icon="long-arrow-alt-left" color="is-link"
                  @click="$emit('click', getClickObject(currentPoint.left))" />
      <ButtonIcon class="is-half marginLeftSmall" :class="getInvisible(currentPoint.right)"
                  icon="long-arrow-alt-right" color="is-link"
                  @click="$emit('click', getClickObject(currentPoint.right))" />
    </div> -->
    <div ref="buttonBox2" class="innerFlexContainerButton is-10">
      <ButtonBasic class="is-half marginBottomSmall marginRightSmall" icon="map" color="is-warning"
                   text="adventureHomeButton1" @click="$emit('click', { type: 'backToMap' })" />
      <ButtonBasic class="is-half marginBottomSmall marginLeftSmall" icon="arrow-right" color="is-success"
                   text="adventureHomeButton2" :disabled="disabledEntry" />
      <ButtonBasic class="is-full" icon="times" color="is-danger" text="adventureHomeButton3"
                   @click="$emit('click', { type: 'abort' })" />
    </div>
    <transition enter-active-class="animated fadeInUp a-little-bit-faster"
                leave-active-class="animated fadeOutDown a-little-bit-faster">
      <div v-show="upgradesVisible" class="upgradesContainer has-background-grey-lighter">
        <h1 class="title marginTopBig" :class="getSizeClass('title')">
          {{ getText(nextUpgradeData.id) }}
        </h1>
        <div class="box imageBox">
          <div class="fullHeight fullWidth backgroundPicture"
               :style="{ backgroundImage: 'url(' + baseUrl + nextUpgradeData.spritePath + ')' }"></div>
        </div>
        <div class="content">
          <ul>
            <li>
              Hi
            </li>
          </ul>
        </div>
        <div class="is-10 flexGrow overflowAuto marginBottomBig">
          <table class="table fullWidth">
            <thead>
              <tr class="headerSticky">
                <td class="has-background-primary">{{ getText('adventureHomeColumn1') }}</td>
                <td class="has-background-primary has-text-centered">{{ getText('adventureHomeColumn2') }}</td>
                <td class="has-background-primary has-text-centered">{{ getText('adventureHomeColumn3') }}</td>
              </tr>
            </thead>
            <tr v-for="cost in nextUpgradeData.costs" :key="cost.id">
              <td>{{ getText(cost.id) }}</td>
              <td class="has-text-centered" :class="isEnough(cost)">{{ ownQuantity(cost.id).toLocaleString() }}</td>
              <td class="has-text-centered">{{ cost.quantity.toLocaleString() }}</td>
            </tr>
          </table>
        </div>
        <div class="is-10">
          <ButtonBasic class="marginBottomSmall" icon="coins" color="is-success" text="adventureHomeUpgradesButton2"
                       :disabled="disabledBuy" />
          <ButtonBasic icon="times" color="is-danger" text="adventureHomeUpgradesButton3" @click="hideUpgrades()" />
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
  mounted () {
    /* let buttonBox1 = window.getComputedStyle(this.$refs.buttonBox1)
    let heights = this.$refs.buttonBox2.clientHeight + this.$refs.buttonBox1.clientHeight
    let upgradeBox = window.getComputedStyle(this.$refs.upgradeBox)
    heights += parseFloat(buttonBox1.getPropertyValue('margin-bottom'))
    heights += parseFloat(upgradeBox.getPropertyValue('margin-bottom'))
    heights += this.$store.getters['vueDict/getHeight']('status')
    heights += this.$store.getters['vueDict/getHeight']('adventure')
    heights += 71
    let maxHeight = window.innerHeight - heights
    this.$refs.upgradeBox.style.maxHeight = maxHeight + 'px'
    this.$refs.table.style.maxHeight = (maxHeight - parseFloat(getComputedStyle(this.$refs.table).fontSize)) + 'px' */
  },
  computed: {
    heights () {
      return this.$store.state.vueDict.heights
    },
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

  .upgradeBox {
    flex-grow: 1;
    padding: .5rem;

    .centered {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .is-30 {
      width: 30%;
    }

    .is-70 {
      width: 70%;
    }

    .is-column {
      flex-direction: column;
    }

    .narrow td {
      padding-top: .25rem;
      padding-bottom: .25rem;
    }

    .imageBox {
      padding: .5rem;
      flex-grow: 1;

      .backgroundPicture {
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
      }
    }
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

  .innerFlexContainerNavigation {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;

    .is-half {
      width: calc(50% - .25rem);
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

    .table tbody tr:last-child td {
      border-bottom-width: 1px !important;
    }
  }
}
</style>
