<template>
  <div class="flexContainer justifyEvenly">
    <HeroBasic title="menuTitle" subtitle="menuSubtitle" lang />
    <div class="is-10 is-relative">
      <div class="is-absolute">
        <transition :enter-active-class="trainingAnimation.enter"
                    :leave-active-class="trainingAnimation.leave">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-link" icon="book" text="menuButton1"
                       @click="$router.push({ name: 'menu', query: { sub: 'training' } })" v-show="!query" />
        </transition>
        <transition :enter-active-class="adventureAnimation.enter"
                    :leave-active-class="adventureAnimation.leave">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-primary" icon="gem" text="menuButton2"
                       @click="$router.push({ name: 'menu', query: { sub: 'adventure' } })" v-show="!query" />
        </transition>
        <transition enter-active-class="animated fadeIn customDuration customDelay"
                    leave-active-class="animated fadeOut customDuration">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-dark" icon="cog" text="menuButton3"
                       @click="$router.push({ name: 'settings' })" v-show="!query" />
        </transition>
      </div>
      <div class="is-absolute">
        <transition enter-active-class="animated invisible customDuration2"
                    leave-active-class="animated disappear customDuration2">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-link" icon="book" text="menuTrainingButton1"
                       @click="$router.push({ name: 'category', params: { destination: 'training' } })"
                       v-show="query === 'training'" />
        </transition>
        <transition :enter-active-class="customEnterAnimation"
                    :leave-active-class="customLeaveAnimation">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-success" icon="pen" text="menuTrainingButton2"
                       @click="$router.push({ name: 'category', params: { destination: 'writeKanji' } })"
                       v-show="query === 'training'" :disabled="inactive" />
        </transition>
        <transition enter-active-class="animated fadeIn customDuration customDelay"
                    leave-active-class="animated fadeOut customDuration">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-danger" icon="arrow-left"
                       text="menuTrainingButton3" @click="$router.push({ name: 'menu' })"
                       v-show="query === 'training'" />
        </transition>
      </div>
      <div class="is-absolute">
        <transition enter-active-class="animated invisible customDuration2"
                    leave-active-class="animated slideOutDownC customDuration2">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-primary" icon="gem" text="menuAdventureButton1"
                       @click="$router.push({ name: 'category', params: { destination: 'adventure' } })"
                       v-show="query === 'adventure'" />
        </transition>
        <transition enter-active-class="animated fadeIn customDuration customDelay"
                    leave-active-class="animated fadeOut customDuration">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-warning" icon="shopping-cart"
                       text="menuAdventureButton2" @click="$router.push({ name: 'shop' })"
                       v-show="query === 'adventure'" />
        </transition>
        <transition enter-active-class="animated fadeIn customDuration customDelay"
                    leave-active-class="animated fadeOut customDuration">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-danger" icon="arrow-left"
                       text="menuAdventureButton3" @click="$router.push({ name: 'menu' })"
                       v-show="query === 'adventure'" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'TheMenu',
  components: {
    HeroBasic,
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
    },
    inactive () {
      return this.$store.state.targetLanguage !== 'japanese'
    },
    customEnterAnimation () {
      return 'animated ' + (this.inactive ? 'fadeInC2' : 'fadeIn') + ' customDuration customDelay'
    },
    customLeaveAnimation () {
      return 'animated ' + (this.inactive ? 'fadeOutC2' : 'fadeOut') + ' customDuration'
    }
  },
  watch: {
    '$route' (to, from) {
      this.trainingAnimation = {
        enter: from.query.sub === 'adventure'
          ? 'animated fadeIn customDuration customDelay'
          : 'animated invisible customDuration2',
        leave: to.query.sub === 'adventure'
          ? 'animated fadeOutC customDuration2'
          : 'animated disappear customDuration2'
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
  height: calc(100% - 71px);

  &.justifyEvenly {
    justify-content: space-evenly;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }
}

.animated {
  &.customDuration {
    -webkit-animation-duration: .35s;
    animation-duration: .35s;
  }

  &.customDuration2 {
    -webkit-animation-duration: .7s;
    animation-duration: .7s;
  }

  &.customDelay {
    -webkit-animation-delay: .35s;
    animation-delay: .35s;
  }
}

.is-absolute {
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}
</style>
