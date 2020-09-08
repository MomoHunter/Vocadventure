<template>
  <div class="flexContainer justifyEvenly">
    <HeroBasic title="menuTitle" :subtitle="subtitleText" />
    <div class="is-10 is-relative">
      <div class="is-absolute">
        <transition :enter-active-class="trainingAnimation.enter"
                    :leave-active-class="trainingAnimation.leave">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-link" icon="book" text="menuButton1"
                       @click="navToTraining()" v-show="!query" />
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
        <transition enter-active-class="animated fadeIn customDuration customDelay"
                    leave-active-class="animated fadeOut customDuration">
          <ButtonBasic class="is-relative marginBottomSmall" color="is-success" icon="pen" text="menuTrainingButton2"
                       @click="$router.push({ name: 'category', params: { destination: 'writeKanji' } })"
                       v-show="query === 'training'" />
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
    <transition enter-active-class="animated bounceInUp" leave-active-class="animated bounceOutDown">
      <TheNotification class="fullWidth" :text="updateText" color="is-success" :icon="updateIcon"
                       :spin="updateIcon === 'cog'" hasIcon v-show="updateText !== ''"
                       @click="hideNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import TheNotification from '@/components/TheNotification.vue'

export default {
  name: 'TheMenu',
  components: {
    HeroBasic,
    ButtonBasic,
    TheNotification
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
    subtitleText () {
      return this.getText('menuSubtitle', this.$store.state.targetLanguage)
    },
    updateText () {
      if (this.$store.state.swUpdated) {
        return 'menuUpdated'
      } else if (this.$store.state.swUpdateFound) {
        return 'menuUpdateFound'
      }
      return ''
    },
    updateIcon () {
      if (this.$store.state.swUpdated) {
        return 'check-square'
      }
      return 'cog'
    }
  },
  methods: {
    getText (id, ...params) {
      return this.$store.getters.getText(id, ...params)
    },
    navToTraining () {
      if (this.$store.state.targetLanguage !== 'japanese') {
        this.$router.push({ name: 'category', params: { destination: 'training' } })
      } else {
        this.$router.push({ name: 'menu', query: { sub: 'training' } })
      }
    },
    hideNotification () {
      this.$store.commit('swReset')
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
