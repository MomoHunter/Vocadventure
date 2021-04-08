<template>
  <div class="item-box flex-column" :class="[getSizeClass('general'), color]">
    <div class="title">
      {{ getText(item.id) }}
    </div>
    <div class="image flex-grow">
      <div class="image-box height-full" :style="{ backgroundImage: 'url(' + baseUrl + itemData.spritePath + ')' }"></div>
    </div>
    <div class="details flex-row">
      <div v-show="equipped" class="icon selected">
        <i class="fas fa-check-square"></i>
      </div>
      <div v-show="mode !== 'shop' && itemData.healing" class="healing">
        +{{ itemData.healing }}HP
      </div>
      <div v-show="mode !== 'shop'" class="flex-grow"></div>
      <ButtonBasic v-show="mode === 'shop'" class="flex-grow" icon="info-circle" color="info" text="shopButtonDetails"
                   @click="$emit('click')" />
      <TheProgressBar v-if="mode !== 'shop' && mode !== 'small' && itemData.durability" class="flex-grow" color="green"
                      :value="item.durability" :maxValue="itemData.durability" />
      <div class="amount">
        {{ quantity }}
      </div>
    </div>
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'
import TheProgressBar from '@/components/TheProgressBar.vue'

export default {
  name: 'ItemBoxBasic',
  props: {
    item: Object,
    mode: {
      type: String,
      default: ''
    },
    equipped: Boolean
  },
  components: {
    ButtonBasic,
    TheProgressBar
  },
  computed: {
    baseUrl () {
      return process.env.BASE_URL
    },
    itemData () {
      return this.$store.getters['vueDict/getItemObject'](this.item.id)
    },
    color () {
      if (this.itemData.categories.includes('weapon')) {
        return 'weapons'
      } else if (this.itemData.categories.includes('consumable')) {
        return 'consumables'
      } else if (this.itemData.categories.includes('armor')) {
        return 'armor'
      } else {
        return 'basic'
      }
    },
    quantity () {
      if (this.item.quantity) {
        return 'x' + this.item.quantity.toLocaleString()
      }
      return '?'
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    }
  }
}
</script>
