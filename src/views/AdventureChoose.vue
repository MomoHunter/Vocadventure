<template>
  <div class="adventure-page">
    <TheBlockquote class="margin-bottom-medium" :text="questionText" />
    <div v-if="hasItems" class="flex-row gap-column-small overflow-auto">
      <ItemBoxBasic class="small" v-for="item in requiredItems" mode="small" :item="item" :key="item.id" />
    </div>
    <div class="flex-grow"></div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="times" color="red" text="adventureChooseButton2"
                   @click="$emit('click', { type: 'chooseNo' })" />
      <ButtonBasic class="width-half" icon="check" color="green" text="adventureChooseButton1"
                   @click="$emit('click', { type: 'chooseYes' })" :disabled="disabled" />
    </div>
  </div>
</template>

<script>
import TheBlockquote from '@/components/TheBlockquote.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ItemBoxBasic from '@/components/ItemBoxBasic.vue'

export default {
  name: 'AdventureChoose',
  components: {
    TheBlockquote,
    ButtonBasic,
    ItemBoxBasic
  },
  computed: {
    questionKey () {
      return this.$store.state.canvasDict.questionKey
    },
    hasItems () {
      if (this.lootableObstacleObject || this.collectableObstacleObject) {
        return true
      }
      return false
    },
    lootableObstacleObject () {
      return this.$store.getters['canvasDict/getLootableObstacleObject']
    },
    collectableObstacleObject () {
      return this.$store.getters['canvasDict/getCollectableObstacleObject']
    },
    requiredItems () {
      if (this.lootableObstacleObject) {
        return this.countRequiredItems(this.lootableObstacleObject.lootableItems)
      } else if (this.collectableObstacleObject) {
        return this.countRequiredItems(this.collectableObstacleObject.collectableItems)
      }
      return []
    },
    collectedItems () {
      return this.$store.state.canvasDict.collectedItems
    },
    questionText () {
      if (this.questionKey === 'adventureChooseQuestion2') {
        if (this.requiredItems.length > 0) {
          return this.getText(
            this.questionKey,
            this.printList(this.itemsToString(this.requiredItems)),
            this.printList(this.itemsToString(this.lootableObstacleObject.lootableItems))
          )
        }
      } else if (this.questionKey === 'adventureChooseQuestion3') {
        if (this.requiredItems.length > 0) {
          return this.getText(
            this.questionKey,
            this.getText(`${this.collectableObstacleObject.id}_a`),
            this.printList(this.itemsToString(this.collectableObstacleObject.collectableItems)),
            this.printList(this.itemsToString(this.requiredItems))
          )
        }
      }
      return this.getText(this.questionKey)
    },
    disabled () {
      if (this.questionKey === 'adventureChooseQuestion2') {
        for (let item of this.requiredItems) {
          let inventoryObject = this.$store.getters['vueDict/getInventoryObject'](item.id)
          let collectedItem = this.collectedItems.find(collItem => collItem.id === item.id)
          let ownItemQuantity = (collectedItem ? collectedItem.quantity : 0) +
            (inventoryObject ? inventoryObject.quantity : 0)
          if (item.quantity > ownItemQuantity) {
            return true
          }
        }
      } else if (this.questionKey === 'adventureChooseQuestion3') {
        for (let item of this.requiredItems) {
          let inventoryObject = this.$store.getters['vueDict/getInventoryObject'](item.id)
          let collectedItem = this.collectedItems.find(collItem => collItem.id === item.id)
          let ownItemQuantity = (collectedItem ? collectedItem.quantity : 0) +
            (inventoryObject ? inventoryObject.quantity : 0)
          if (item.quantity > ownItemQuantity) {
            return true
          }
        }
      }
      return false
    }
  },
  methods: {
    getText (id, ...params) {
      return this.$store.getters.getText(id, ...params)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    itemsToString (items) {
      return items.map(({ id, quantity }) =>
        `${quantity} ${this.getText(quantity === 1 ? id : `${id}_m`)}`
      )
    },
    printList (list) {
      return list.length > 1 ? `${list.slice(0, -1).join(', ')} und ${list.slice(-1)}` : list[0]
    },
    countRequiredItems (items) {
      return items.reduce((newArray, item) => {
        for (let requiredItem of this.$store.getters['vueDict/getItemObject'](item.id).required) {
          let foundItem = newArray.find(itemInArray => itemInArray.id === requiredItem.id)
          if (foundItem) {
            foundItem.quantity += requiredItem.quantity
          } else {
            newArray.push({
              id: requiredItem.id,
              quantity: requiredItem.quantity
            })
          }
        }
        return newArray
      }, [])
    }
  }
}
</script>
