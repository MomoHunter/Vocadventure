<template>
  <div class="adventure-page">
    <HeroBasic class="mini" title="adventureMapButton1" :subtitle="[currentLevel]" />
    <div class="details flex-grow overflow-auto">
      <TitleBasic text="adventureMapDetailsSteps" icon="shoe-prints" color="info" />
      <div class="section-text margin-bottom-medium" :class="getSizeClass('general')">
        {{ dynamicLevelData.steps }}
      </div>
      <TitleBasic class="margin-bottom-mini" text="adventureMapDetailsFoundItems" icon="plus" color="green" />
      <div v-if="dynamicLevelData.itemsFound.length > 0" class="flex-row gap-column-small overflow-auto margin-bottom-medium">
        <ItemBoxBasic class="small" v-for="item in dynamicLevelData.itemsFound" mode="small" :item="item" :key="item.id" />
      </div>
      <div v-else class="item-box-replacement margin-bottom-medium" :class="getSizeClass('general')">
        {{ getText('adventureMapDetailsNoItems') }}
      </div>
      <TitleBasic text="adventureMapDetailsKilledEnemies" icon="skull-crossbones" color="red" />
      <div class="enemies" :class="getSizeClass('general')">
        <div class="entry" v-for="enemy in dynamicLevelData.killedEnemies" :key="enemy.id">
          <div class="name">
            {{ getText(enemy.id) }}
          </div>
          <div class="amount">
            {{ getText(enemy.amount) }}
          </div>
        </div>
        <div v-show="dynamicLevelData.killedEnemies.length === 0" class="no-entry">
          {{ getText('adventureMapDetailsNoEnemies') }}
        </div>
      </div>
    </div>
    <div class="button-container">
      <ButtonIcon class="width-third" icon="long-arrow-alt-left" color="action"
                  @click="$emit('click', getClickObject(currentMapPoint.cl))"
                  :disabled="hasLevel(currentMapPoint.cl)" />
      <ButtonIcon class="width-third" :class="getInvisible(currentMapPoint.cc)" icon="home" color="green"
                  @click="$emit('click', getClickObject(currentMapPoint.cc, true))"
                  :disabled="hasLevel(currentMapPoint.cc)" />
      <ButtonIcon class="width-third" icon="long-arrow-alt-right" color="action"
                  @click="$emit('click', getClickObject(currentMapPoint.cr))"
                  :disabled="hasLevel(currentMapPoint.cr)" />
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="times" text="adventureMapButton3" color="red"
                   @click="$emit('click', { type: 'abort' })" />
      <ButtonBasic class="width-half" icon="check" text="adventureMapButton2" color="green"
                   @click="$emit('click', { type: 'selectLevel' })" />
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import TitleBasic from '@/components/TitleBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ItemBoxBasic from '@/components/ItemBoxBasic.vue'

export default {
  name: 'AdventureMapNavigation',
  components: {
    HeroBasic,
    TitleBasic,
    ButtonIcon,
    ButtonBasic,
    ItemBoxBasic
  },
  data () {
    return {
      detailsVisible: false
    }
  },
  computed: {
    currentMapPoint () {
      return this.$store.getters['canvasDict/currentMapPoint']
    },
    currentLevel () {
      return this.$store.state.canvasDict.currentLevel
    },
    dynamicLevelData () {
      return this.$store.getters['canvasDict/getDynamicLevelData'](this.currentLevel)
    },
    items () {
      return this.$store.getters['canvasDict/getDynamicLevelData'](this.currentLevel).itemsFound
    }
  },
  methods: {
    getText (id, ...params) {
      return this.$store.getters.getText(id, ...params)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    hasLevel (direction) {
      if (!direction || !this.$store.state.canvasDict.dynamicLevelData[direction]) {
        return true
      }
      return false
    },
    getInvisible (link) {
      if (!link || !this.$store.state.canvasDict.dynamicLevelData[link]) {
        return 'invisible'
      }
      return ''
    },
    getClickObject (target, home = false) {
      return {
        type: 'navigateToLevel',
        value: target,
        home: home
      }
    },
    showDetails () {
      this.detailsVisible = true
    },
    hideDetails () {
      this.detailsVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.details {
  height: 1rem;
}
</style>
