<template>
  <div class="flexContainer justifyEvenly">
    <TheHero title="menuTitle" subtitle="menuSubtitle"/>
    <div class="is-10 is-relative">
      <div class="is-absolute">
        <transition :enter-active-class="trainingAnimation.enter"
                    :leave-active-class="trainingAnimation.leave">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-info" icon="book" text="menuButton1"
                      @click="$router.push({ name: 'menu', query: { sub: 'training' } })" v-show="!query" />
        </transition>
        <transition :enter-active-class="adventureAnimation.enter"
                    :leave-active-class="adventureAnimation.leave">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-link" icon="gem" text="menuButton2"
                      @click="$router.push({ name: 'menu', query: { sub: 'adventure' } })" v-show="!query" />
        </transition>
        <transition enter-active-class="animated fadeIn customDuration customDelay"
                    leave-active-class="animated fadeOut customDuration">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-dark" icon="cog" text="menuButton3"
                      @click="$router.push({ name: 'settings' })" v-show="!query" />
        </transition>
      </div>
      <div class="is-absolute">
        <transition enter-active-class="animated appear customDuration customDelay"
                    leave-active-class="animated disappear customDuration">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-info" icon="book" text="menuTrainingButton1"
                      @click="$router.push({ name: 'selection', params: { destination: 'training' } })"
                      v-show="query === 'training'" />
        </transition>
        <transition enter-active-class="animated fadeIn customDuration customDelay"
                    leave-active-class="animated fadeOut customDuration">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-success" icon="pen" text="menuTrainingButton2"
                      @click="$router.push({ name: 'kanji' })" v-show="query === 'training'" />
        </transition>
        <transition enter-active-class="animated fadeIn customDuration customDelay"
                    leave-active-class="animated fadeOut customDuration">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-danger" icon="arrow-left" text="menuTrainingButton3"
                      @click="$router.push({ name: 'menu' })" v-show="query === 'training'" />
        </transition>
      </div>
      <div class="is-absolute">
        <transition enter-active-class="animated invisible customDuration2"
                    leave-active-class="animated slideOutDownC customDuration2">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-link" icon="gem" text="menuAdventureButton1"
                      @click="$router.push({ name: 'selection', params: { destination: 'adventure' } })"
                      v-show="query === 'adventure'" />
        </transition>
        <transition enter-active-class="animated fadeIn customDuration customDelay"
                    leave-active-class="animated fadeOut customDuration">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-warning" icon="shopping-cart" text="menuAdventureButton2"
                      @click="$router.push({ name: 'shop' })" v-show="query === 'adventure'" />
        </transition>
        <transition enter-active-class="animated fadeIn customDuration customDelay"
                    leave-active-class="animated fadeOut customDuration">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-danger" icon="arrow-left" text="menuAdventureButton3"
                      @click="$router.push({ name: 'menu' })" v-show="query === 'adventure'" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import TheHero from '@/components/TheHero.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheMenu',
  components: {
    TheHero,
    ButtonBasic
  },
  data () {
    return {
      trainingAnimation: {
        enter: '',
        leave: ''
      },
      adventureAnimation: {
        enter: '',
        leave: ''
      }
    }
  },
  computed: {
    query () {
      return this.$route.query.sub
    }
  },
  watch: {
    '$route' (to, from) {
      this.trainingAnimation = {
        enter: from.query.sub === 'adventure'
          ? 'animated fadeIn customDuration customDelay'
          : 'animated appear customDuration customDelay',
        leave: to.query.sub === 'adventure'
          ? 'animated fadeOutC customDuration2'
          : 'animated disappear customDuration'
      }
      this.adventureAnimation = {
        enter: from.query.sub === 'training'
          ? 'animated fadeIn customDuration customDelay'
          : 'animated invisible customDuration2',
        leave: to.query.sub === 'training'
          ? 'animated fadeOut customDuration'
          : 'animated slideOutUpC customDuration2'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/customAnimations.scss';

.flexContainer {
  width: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  height: 100%;

  &.justifyEvenly {
    justify-content: space-evenly;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }
}

.animated {
  &.customDuration {
    -webkit-animation-duration: .5s;
    animation-duration: .5s;
  }

  &.customDuration2 {
    -webkit-animation-duration: 1s;
    animation-duration: 1s;
  }

  &.customDelay {
    -webkit-animation-delay: .5s;
    animation-delay: .5s;
  }
}

.is-absolute {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}
</style>
