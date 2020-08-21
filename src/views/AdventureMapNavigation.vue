<template>
  <div class="flexboxContainer">
    <transition enter-active-class="animated zoomIn a-little-bit-faster"
                leave-active-class="animated zoomOut a-little-bit-faster">
      <div class="itemContainer marginBottomBig flexGrow" v-show="items.length > 0">
        <ItemBoxSmall class="fullHeight" :item="item" v-for="item in items" :key="item.id" />
      </div>
    </transition>
    <transition enter-active-class="animated zoomIn a-little-bit-faster"
                leave-active-class="animated zoomOut a-little-bit-faster">
      <div class="content flexGrow centerContent" :class="getSizeClass('content')"
           v-show="items.length === 0 && currentLevel !== 'home'">
        {{ getText('adventureMapNoItems') }}
      </div>
    </transition>
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
      <ButtonBasic class="marginBottomSmall" icon="check" text="adventureMapButton1" color="is-success"
                   @click="$emit('click', { type: 'selectLevel' })" />
      <ButtonBasic icon="times" text="adventureMapButton2" color="is-danger" @click="$emit('click', { type: 'abort' })" />
    </div>
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
  computed: {
    currentMapPoint () {
      return this.$store.getters['canvasDict/currentMapPoint']
    },
    currentLevel () {
      return this.$store.state.canvasDict.currentLevel
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

  .flexGrow {
    flex-grow: 1;
  }

  .centerContent {
    display: flex;
    align-items: center;
  }

  .itemContainer {
    display: flex;
    max-height: 90px;
    width: calc(100% / 1.2);
    max-width: calc(100% / 1.2);
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
}
</style>
