<template>
  <div class="flexboxContainer">
    <div class="is-10 marginBottomSmall marginTopSmall">
      <ButtonBasic icon="list" color="is-info" text="adventureMapButton1" @click="showDetails()" />
    </div>
    <div class="gridContainer is-10 marginBottomBig">
      <ButtonIcon class="top-center" :class="getInvisible(currentMapPoint.tc)" icon="long-arrow-alt-up" color="is-link"
                  @click="$emit('click', getClickObject(currentMapPoint.tc))" />
      <ButtonIcon class="center-left" :class="getInvisible(currentMapPoint.cl)" icon="long-arrow-alt-left"
                  color="is-link" @click="$emit('click', getClickObject(currentMapPoint.cl))" />
      <ButtonIcon class="center-center" :class="getInvisible(currentMapPoint.cc)" icon="home" color="is-success"
                  @click="$emit('click', getClickObject(currentMapPoint.cc, true))" />
      <ButtonIcon class="center-right" :class="getInvisible(currentMapPoint.cr)" icon="long-arrow-alt-right"
                  color="is-link" @click="$emit('click', getClickObject(currentMapPoint.cr))" />
      <ButtonIcon class="bottom-center" :class="getInvisible(currentMapPoint.bc)" icon="long-arrow-alt-down"
                  color="is-link" @click="$emit('click', getClickObject(currentMapPoint.bc))" />
    </div>
    <div class="is-10">
      <ButtonBasic class="marginBottomSmall" icon="check" text="adventureMapButton2" color="is-success"
                   @click="$emit('click', { type: 'selectLevel' })" />
      <ButtonBasic icon="times" text="adventureMapButton3" color="is-danger" @click="$emit('click', { type: 'abort' })" />
    </div>
    <transition enter-active-class="animated fadeInUp a-little-bit-faster"
                leave-active-class="animated fadeOutDown a-little-bit-faster">
      <div v-show="detailsVisible" class="detailsContainer has-background-background">
        <h1 class="title marginTopBig" :class="getSizeClass('title')">
          {{ getText(currentLevel) }}
        </h1>
        <div class="is-10 marginBottomBig">
          <h2 class="subtitle has-text-weight-bold marginBottomSmall" :class="getSizeClass('subtitle')">
            {{ getText('adventureMapDetailsSteps') }}
          </h2>
          <div class="content" :class="getSizeClass('content')">
            {{ dynamicLevelData.steps }}
          </div>
        </div>
        <div class="is-10">
          <h2 class="subtitle has-text-weight-bold marginBottomSmall" :class="getSizeClass('subtitle')">
            {{ getText('adventureMapDetailsFoundItems') }}
          </h2>
          <div class="itemContainer marginBottomBig flexGrow" v-show="dynamicLevelData.itemsFound.length > 0">
            <ItemBoxSmall :item="item" v-for="item in dynamicLevelData.itemsFound" :key="item.id" />
          </div>
        </div>
        <div class="is-10 flexGrow">
          <h2 class="subtitle has-text-weight-bold marginBottomSmall" :class="getSizeClass('subtitle')">
            {{ getText('adventureMapDetailsKilledEnemies') }}
          </h2>
          <div class="overflowAuto">
            <table class="table fullWidth">
              <thead>
                <tr class="headerSticky">
                  <td class="has-background-primary" :class="getSizeClass('td')">{{ getText('adventureMapDetailsColumn1') }}</td>
                  <td class="is-3 has-background-primary" :class="getSizeClass('td')">{{ getText('adventureMapDetailsColumn2') }}</td>
                </tr>
              </thead>
              <tr v-for="(enemy, index) in dynamicLevelData.killedEnemies" :key="index">
                <td :class="getSizeClass('td')">{{ getText(enemy.id) }}</td>
                <td :class="getSizeClass('td')">{{ getText(enemy.amount) }}</td>
              </tr>
            </table>
          </div>
        </div>
        <ButtonBasic class="is-10" icon="times" color="is-danger" text="adventureMapDetailsButton1"
                     @click="hideDetails()" />
      </div>
    </transition>
  </div>
</template>

<script>
import ButtonIcon from '@/components/ButtonIcon.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import ItemBoxSmall from '@/components/ItemBoxSmall.vue'

export default {
  name: 'AdventureMapNavigation',
  components: {
    ButtonIcon,
    ButtonBasic,
    ItemBoxSmall
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
.flexboxContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
  padding-bottom: 71px;

  .is-10 {
    width: calc(100% / 1.2);
  }

  .is-3 {
    width: calc(100% / 4);
  }

  .flexGrow {
    flex-grow: 1;
  }

  .centerContent {
    display: flex;
    align-items: center;
  }

  .itemContainer {
    display: flex;
    width: 100%;
    max-width: 100%;
    overflow: auto;

    > :not(:last-child) {
      margin-right: .5rem;
    }
  }

  .gridContainer {
    display: grid;
    grid-template-columns: repeat(3, auto);
    grid-template-rows: repeat(3, auto);
    grid-column-gap: .5rem;
    grid-row-gap: .5rem;

    .invisible {
      opacity: .2;
      pointer-events: none;
    }

    > .top-left {
      grid-area: 1 / 1 / 2 / 2;
    }

    > .top-center {
      grid-area: 1 / 2 / 2 / 3;
    }

    > .top-right {
      grid-area: 1 / 3 / 2 / 4;
    }

    > .center-left {
      grid-area: 2 / 1 / 3 / 2;
    }

    > .center-center {
      grid-area: 2 / 2 / 3 / 3;
    }

    > .center-right {
      grid-area: 2 / 3 / 3 / 4;
    }

    > .bottom-left {
      grid-area: 3 / 1 / 4 / 2;
    }

    > .bottom-center {
      grid-area: 3 / 2 / 4 / 3;
    }

    > .bottom-right {
      grid-area: 3 / 3 / 4 / 4;
    }
  }

  .detailsContainer {
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

    .headerSticky td {
      position: sticky;
      top: 0px;
      z-index: 20;
    }
  }
}
</style>
