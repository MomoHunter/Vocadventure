<template>
  <div class="flexboxContainer">
    <div class="innerFlexContainerNavigation is-10 marginBottomBig">
      <ButtonIcon class="is-half marginRightSmall" :class="getInvisible(currentPoint.left)"
                  icon="long-arrow-alt-left" color="is-link"
                  @click="$emit('click', getClickObject(currentPoint.left))" />
      <ButtonIcon class="is-half marginLeftSmall" :class="getInvisible(currentPoint.right)"
                  icon="long-arrow-alt-right" color="is-link"
                  @click="$emit('click', getClickObject(currentPoint.right))" />
    </div>
    <div class="innerFlexContainerButton is-10">
      <ButtonBasic class="is-half marginBottomSmall marginRightSmall" icon="map" color="is-warning"
                   text="adventureHomeButton1" @click="$emit('click', { type: 'backToMap' })" />
      <ButtonBasic class="is-half marginBottomSmall marginLeftSmall" icon="arrow-right" color="is-success"
                   text="adventureHomeButton2" />
      <ButtonBasic class="is-full" icon="times" color="is-danger" text="adventureHomeButton3"
                   @click="$emit('click', { type: 'abort' })" />
    </div>
  </div>
</template>

<script>
import ButtonBasic from '@/components/ButtonBasic.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

export default {
  name: 'AdventureHome',
  components: {
    ButtonBasic,
    ButtonIcon
  },
  computed: {
    currentPoint () {
      return this.$store.getters['canvasDict/currentHomePoint']
    }
  },
  methods: {
    getClickObject (target) {
      return {
        type: 'navigateToHomePoint',
        value: target
      }
    },
    getInvisible (link) {
      if (!link || !this.$store.state.canvasDict.unlockedBuildings.includes(link)) {
        return 'invisible'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.flexboxContainer {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 71px;

  .is-10 {
    width: calc(100% / 1.2);
  }

  .innerFlexContainerNavigation {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;

    .is-half {
      width: calc(50% - .25rem);
    }

    .invisible {
      opacity: .2;
      pointer-events: none;
    }
  }

  .innerFlexContainerButton {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    .is-half {
      width: calc(50% - .25rem);
    }

    .is-full {
      width: 100%;
    }
  }
}
</style>
