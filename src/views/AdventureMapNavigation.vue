<template>
  <div class="flexboxContainer">
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

export default {
  name: 'AdventureMapNavigation',
  components: {
    ButtonIcon,
    ButtonBasic
  },
  computed: {
    currentMapPoint () {
      return this.$store.getters['canvasDict/currentMapPoint']
    }
  },
  methods: {
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

  .levelContainer {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
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
