<template>
  <div class="page">
    <HeroBasic :title="item.id" />
    <div v-if="quantity >= 0" class="margin-top-mini margin-bottom-mini margin-left-mini">
      <TagBasic title="detailsTagOwn" :text="quantity" color="info-2" />
    </div>
    <div class="flex-grow flex-column overflow-auto">
      <div class="shop-image width-full margin-bottom-medium" :class="getSizeClass('general')">
        <div class="image-box" :style="{ backgroundImage: 'url(' + baseUrl + item.spritePath + ')' }"></div>
      </div>
      <TheBlockquote class="margin-bottom-medium" :text="item.id + 'Desc'" />
      <div class="section-title" :class="getSizeClass('general')">
        {{ getText('detailsCostsTitle') }}
      </div>
      <div class="costs" :class="getSizeClass('general')">
        <div class="entry flex-row" v-for="cost in item.costs" :key="cost.id">
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
            {{ formatValue(cost.quantity * amount) }}
          </div>
        </div>
      </div>
    </div>
    <div class="button-container flex-row">
      <ButtonIcon v-show="!inputVisible" icon="minus" color="action" @click="redAmount()" />
      <ButtonText v-show="!inputVisible" class="flex-grow" color="action" :text="amount" @click="showInput()" />
      <InputWithButton v-if="inputVisible" class="flex-grow" type="number" iconInput="times" iconButton="check"
                       colorInput="action" colorButton="green" :maxlength="3" v-model="inputAmount"
                       @click="hideInput()" />
      <ButtonIcon v-show="!inputVisible" icon="plus" color="action" @click="incAmount()" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="times" color="red" text="detailsButton2"
                   @click="navTo()" />
      <ButtonBasic class="width-half" icon="coins" color="green" text="detailsButton1" @click="buy()"
                   :disabled="!canBuy" />
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonText from '@/components/ButtonText.vue'
import InputWithButton from '@/components/InputWithButton.vue'
import TagBasic from '@/components/TagBasic.vue'
import TheBlockquote from '@/components/TheBlockquote.vue'

export default {
  name: 'TheDetails',
  components: {
    HeroBasic,
    ButtonBasic,
    ButtonIcon,
    ButtonText,
    InputWithButton,
    TagBasic,
    TheBlockquote
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
    quantity () {
      let itemData = this.$store.getters['vueDict/getInventoryObject'](this.$route.params.item)

      if (!itemData) {
        if (this.item.output) {
          return -1
        }
        return 0
      } else {
        return itemData.quantity.toLocaleString()
      }
    },
    canBuy () {
      this.item.costs.forEach(entry => {
        if (this.ownQuantity(entry.id) < entry.quantity * this.amount) {
          return false
        }
      }, this)

      return true
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
    getCostIcon (itemId) {
      let itemData = this.$store.getters['vueDict/getItemObject'](itemId)
      if (itemData) {
        return itemData.spritePath
      } else if (itemId === 'coins') {
        return 'img/items/coin.png'
      }
      return ''
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
        return 'green'
      }
      return 'red'
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
            id: itemData.id,
            quantity: itemData.quantity,
            categories: itemData.categories,
            durability: itemData.durability || null
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
          categories: this.item.categories,
          durability: this.item.durability || null
        }
        this.$store.commit('vueDict/addToInventory', newItem)
        this.addBoughtItem(newItem)
        this.$store.commit('vueDict/unlockItem', this.item.id)
        this.$store.commit('vueDict/addStat', { id: 'points', quantity: this.item.points })
      }
      window.localStorage.setItem('globalDict', JSON.stringify(this.$store.getters.getSaveData))
      this.navTo()
      this.$store.commit('vueDict/setBoughtItems', this.boughtItems)
      this.boughtItems = []
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
    navTo () {
      this.$router.push({ name: 'shop' })
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
.costs {
  align-items: center;
}
</style>
