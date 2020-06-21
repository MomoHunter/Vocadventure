<template>
  <div class="flexContainer">
    <HeroWithTags class="marginBottomSmall" :title="item.id" :tagObjects="tags" />
    <div class="box is-10 flexGrow">
      <div class="fullWidth fullHeight backgroundPicture"
           :style="{ backgroundImage: 'url(' + baseUrl + item.spritePath + ')' }"></div>
    </div>
    <div class="is-10 content" :class="getSizeClass('content')">
      <blockquote>
        {{ getText(item.id + 'Desc') }}
      </blockquote>
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
        <td class="has-text-centered" :class="isEnough(cost)">{{ ownQuantity(cost.id).toLocaleString() }}</td>
        <td class="has-text-centered">{{ (cost.quantity * amount).toLocaleString() }}</td>
      </tr>
    </table>
    <div class="is-10 buttonContainer">
      <ButtonIcon class="is-1 marginRightSmall marginBottomSmall" color="is-link" icon="minus" @click="redAmount()" />
      <ButtonText v-show="!inputVisible" class="is-8 marginRightSmall marginLeftSmall marginBottomSmall" color="is-link"
                  :text="amount" @click="showInput()" />
      <InputWithButton v-if="inputVisible" class="is-8 marginRightSmall marginLeftSmall marginBottomSmall"
                       colorInput="is-link" colorButton="is-success" type="number" iconButton="check"
                       v-model="inputAmount" @click="hideInput()" />
      <ButtonIcon class="is-1 marginLeftSmall marginBottomSmall" color="is-link" icon="plus" @click="incAmount()" />
      <ButtonBasic class="is-half marginRightSmall" icon="arrow-left" text="detailsButton2" color="is-danger"
                   @click="$router.push({ name: 'shop' })" />
      <ButtonBasic class="is-half marginLeftSmall" icon="coins" text="detailsButton1" color="is-success"
                   @click="buy()" />
    </div>
    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
      <TheNotification v-show="notificationVisible" class="fullWidth" color="is-danger" text="detailsNotification"
                       @click="closeNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroWithTags from '@/components/HeroWithTags.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonText from '@/components/ButtonText.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import TheNotification from '@/components/TheNotification.vue'

export default {
  name: 'TheDetails',
  components: {
    HeroWithTags,
    ButtonBasic,
    ButtonIcon,
    ButtonText,
    InputWithButton,
    TheNotification
  },
  data () {
    return {
      inputVisible: false,
      notificationVisible: false,
      amount: 1,
      inputAmount: '1',
      boughtItems: []
    }
  },
  computed: {
    item () {
      return this.$store.getters['vueDict/getItemObject'](this.$route.params.item)
    },
    tags () {
      let quantity = this.$store.getters['vueDict/getInventoryObject'](this.$route.params.item)
      if (!quantity) {
        if (this.item.output) {
          return []
        }
        quantity = 0
      } else {
        quantity = quantity.quantity
      }
      return [
        {
          nameId: 'detailsTagOwn',
          valueId: quantity.toLocaleString(),
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
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    redAmount () {
      if (this.amount === 1) {
        let maxAmount = 999

        for (let cost of this.item.costs) {
          let ownQuantity = this.ownQuantity(cost.id)
          if (ownQuantity / cost.quantity < maxAmount) {
            maxAmount = Math.max(Math.floor(ownQuantity / cost.quantity), 1)
          }
        }
        this.amount = maxAmount
      } else {
        this.amount -= 1
      }
      this.inputAmount = this.amount.toString()
    },
    incAmount () {
      this.amount = Math.min(this.amount + 1, 999)
      this.inputAmount = this.amount.toString()
    },
    showInput () {
      this.inputVisible = true
    },
    hideInput () {
      this.inputVisible = false
      if (this.inputAmount === '') {
        this.inputAmount = '1'
      }
      this.amount = parseInt(this.inputAmount)
    },
    isEnough (costObject) {
      if (this.ownQuantity(costObject.id) >= costObject.quantity * this.amount) {
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
        if (this.ownQuantity(entry.id) < entry.quantity * this.amount) {
          buyable = false
        }
      }, this)

      if (buyable) {
        this.item.costs.forEach(entry => {
          if (entry.id === 'coins') {
            this.$store.commit('vueDict/addStat', { id: entry.id, quantity: -entry.quantity * this.amount })
          } else {
            this.$store.commit('vueDict/addToInventory', { id: entry.id, quantity: -entry.quantity * this.amount })
          }
        }, this)

        if (this.item.output) {
          let max = this.item.output.reduce((acc, value) => { return acc + value.chance }, 0)
          let itemData = null

          for (let i = 0; i < this.amount; i++) {
            let random = max * Math.random()

            for (let output of this.item.output) {
              random -= output.chance
              if (random <= 0) {
                itemData = this.$store.getters['vueDict/getItemObject'](output.id)
                break
              }
            }

            let newItem = {
              id: this.item.id,
              quantity: this.item.quantity * this.amount,
              category: this.item.category || null,
              durability: this.item.durability || null
            }

            this.$store.commit('vueDict/addToInventory', newItem)
            this.addBoughtItem(newItem)
            this.$store.commit('vueDict/unlockItem', itemData.id)
            this.$store.commit('vueDict/addStat', { id: 'points', quantity: itemData.points })
          }
        } else {
          let newItem = {
            id: this.item.id,
            quantity: this.item.quantity * this.amount,
            category: this.item.category || null,
            durability: this.item.durability || null
          }
          this.$store.commit('vueDict/addToInventory', newItem)
          this.addBoughtItem(newItem)
          this.$store.commit('vueDict/unlockItem', this.item.id)
          this.$store.commit('vueDict/addStat', { id: 'points', quantity: this.item.points })
        }
        window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
        this.$router.push({ name: 'shop' })
        this.$store.commit('vueDict/setBoughtItems', this.boughtItems)
        this.boughtItems = []
      } else {
        this.notificationVisible = true
      }
    },
    addBoughtItem (item) {
      let itemData = this.boughtItems.find(bought => bought.id === item.id)

      if (itemData) {
        itemData.quantity += item.quantity
      } else {
        this.boughtItems.push({
          id: item.id,
          quantity: item.quantity,
          durability: item.durability || null
        })
      }
    },
    closeNotification () {
      this.notificationVisible = false
    }
  },
  watch: {
    inputAmount () {
      if (parseInt(this.inputAmount) > 999) {
        this.inputAmount = '999'
      } else if (parseInt(this.inputAmount) < 1 && this.inputAmount !== '') {
        this.inputAmount = '1'
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

  .buttonContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    .is-1 {
      width: calc(100% / 10 - .25rem);
    }

    .is-8 {
      width: calc(100% / 1.25 - .5rem);
    }

    .is-half {
      width: calc(50% - .25rem);
    }
  }
}
</style>
