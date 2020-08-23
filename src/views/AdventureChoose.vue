<template>
  <div class="flexboxContainer is-10">
    <div class="content flexing marginTopMiddle has-text-centered flex-grow" :class="getSizeClass('content')">
      <blockquote>
        {{ questionText }}
      </blockquote>
      <div class="itemBar overflowAuto flex-grow" v-if="hasItems">
        <ItemBoxSmall class="customBox" v-for="item in requiredItems" :key="item.id" :item="item" hasInventoryCount />
      </div>
    </div>
    <div>
      <ButtonBasic class="marginBottomSmall" icon="check" text="adventureChooseButton1" color="is-success"
                   @click="$emit('click', { type: 'chooseYes' })" :disabled="disabled" />
      <ButtonBasic icon="times" text="adventureChooseButton2" color="is-danger"
                   @click="$emit('click', { type: 'chooseNo' })" />
    </div>
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'
import ItemBoxSmall from '@/components/ItemBoxSmall.vue'

export default {
  name: 'AdventureChoose',
  components: {
    ButtonBasic,
    ItemBoxSmall
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

<style lang="scss" scoped>
.flexboxContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding-bottom: 71px;

  &.is-10 {
    width: calc(100% / 1.2);
  }

  .content.flexing {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .flex-grow {
    flex-grow: 1;
  }

  .itemBar {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    height: 100%;

    .customBox {
      min-width: 110px;
      position: relative;
    }
  }
}
</style>
