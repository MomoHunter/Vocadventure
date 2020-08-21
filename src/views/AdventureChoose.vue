<template>
  <div class="flexboxContainer is-10">
    <div class="content flexing marginTopMiddle has-text-centered flex-grow" :class="getSizeClass('content')">
      <blockquote>
        {{ questionText }}
      </blockquote>
      <div class="itemBar overflowAuto flex-grow" v-if="hasItems">
        <ItemBoxSmall class="customBox" v-for="item in items" :key="item.id" :item="item" hasInventoryCount />
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
    hasItems () {
      return !!this.lootableObstacleObject.lootableItems
    },
    lootableObstacleObject () {
      return this.$store.getters['canvasDict/getLootableObstacleObject']
    },
    items () {
      if (this.lootableObstacleObject) {
        return this.lootableObstacleObject.lootableItems.reduce((newArray, lootableItem) => {
          for (let requiredItem of this.$store.getters['vueDict/getItemObject'](lootableItem.id).required) {
            let foundItem = newArray.find(item => item.id === requiredItem.id)
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
      return []
    },
    questionText () {
      if (this.$store.state.canvasDict.questionKey === 'adventureChooseQuestion2') {
        if (this.items.length > 0) {
          const requiredItemTexts = this.items.map(({ id, quantity }) =>
            `${quantity} ${this.getText(quantity === 1 ? id : `${id}_m`)}`
          )
          const lootableItemTexts = this.lootableObstacleObject.lootableItems.map(({ id, quantity }) =>
            `${quantity} ${this.getText(quantity === 1 ? id : `${id}_m`)}`
          )

          return this.getText(
            'adventureChooseQuestion2',
            this.printList(requiredItemTexts),
            this.printList(lootableItemTexts)
          )
        }
        return this.getText('adventureChooseQuestion2', '', '')
      } else if (this.$store.state.canvasDict.questionKey === 'adventureChooseQuestion3') {

      }
      return this.getText(this.$store.state.canvasDict.questionKey)
    },
    disabled () {
      if (this.$store.state.canvasDict.questionKey === 'adventureChooseQuestion2') {
        for (let item of this.items) {
          let inventoryObject = this.$store.getters['vueDict/getInventoryObject'](item.id)
          if (!inventoryObject || item.correctedQuantity >= inventoryObject.quantity) {
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
    printList (list) {
      return list.length > 1 ? `${list.slice(0, -1).join(', ')} und ${list.slice(-1)}` : list[0]
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
