<template>
  <div class="page">
    <HeroBasic title="menuTitle" :subtitle="subtitleText" />
    <div class="menu-button-container width-full relative" :class="getSizeClass('general')">
      <div class="width-full absolute">
        <transition :enter-active-class="trainingAnimation.enter"
                    :leave-active-class="trainingAnimation.leave">
          <ButtonBasic v-show="isVisible(1)" class="menu width-half" color="info" icon="book" text="menuButton1"
                       @click="navTo('menu', 'training')" />
        </transition>
        <transition :enter-active-class="adventureAnimation.enter"
                    :leave-active-class="adventureAnimation.leave">
          <ButtonBasic v-show="isVisible(1)" class="menu width-half" color="green" icon="gem" text="menuButton2"
                       @click="navTo('menu', 'adventure')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(1)" class="menu width-full" color="settings" icon="cog" text="menuButton3"
                       @click="navTo('settings')" />
        </transition>
      </div>
      <div class="width-full absolute">
        <transition enter-active-class="invisible duration-c-700ms"
                    leave-active-class="disappear duration-c-700ms">
          <ButtonBasic v-show="isVisible(2)" class="menu width-half" color="info" icon="book"
                       text="menuTrainingButton1" @click="navTo('category', 'training')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(2)" class="menu width-half" color="info-2" icon="pen"
                       text="menuTrainingButton2" @click="navTo('category', 'writeKanji')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(2)" class="menu width-full" color="red" icon="arrow-left"
                       text="menuTrainingButton3" @click="navTo('menu')" />
        </transition>
      </div>
      <div class="width-full absolute">
        <transition enter-active-class="invisible duration-c-700ms"
                    leave-active-class="animate__animated animate__slideOutRight duration-c-700ms">
          <ButtonBasic v-show="isVisible(3)" class="menu width-half" color="green" icon="gem"
                       text="menuAdventureButton1" @click="navTo('category', 'adventure')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(3)" class="menu width-half" color="yellow" icon="shopping-cart"
                       text="menuAdventureButton2" @click="navTo('shop')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(3)" class="menu width-full" color="red" icon="arrow-left"
                       text="menuAdventureButton3" @click="navTo('menu')" />
        </transition>
      </div>
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms">
      <NotificationBasic v-show="notificationVisible" title="menuNotificationTitle" :text="updateText" color="green"
                       :icon="updateIcon" :spin="updateIcon === 'cog'" @click="hideNotification()" />
    </transition>
  </div>
</template>

<script>
import HeroBasic from '@/components/HeroBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import NotificationBasic from '@/components/NotificationBasic.vue'

export default {
  name: 'TheMenu',
  components: {
    HeroBasic,
    ButtonBasic,
    NotificationBasic
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
    subtitleText () {
      return ['menuSubtitle', this.$store.state.targetLanguage]
    },
    notificationVisible () {
      return this.$store.state.swUpdated || this.$store.state.swUpdateFound
    },
    updateText () {
      if (this.$store.state.swUpdated) {
        return ['menuNotificationUpdated']
      } else if (this.$store.state.swUpdateFound) {
        return ['menuNotificationUpdateFound']
      }
      return ['']
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
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    isVisible (id) {
      switch (id) {
        case 1: // main
          return !this.$route.query.sub
        case 2: // training
          return this.$route.query.sub === 'training'
        case 3: // adventure
          return this.$route.query.sub === 'adventure'
        default:
          return false
      }
    },
    navTo (name, additional = '') {
      if (name === 'menu' && additional === 'training' && this.$store.state.targetLanguage !== 'japanese') {
        name = 'category'
      }

      switch (name) {
        case 'menu':
          if (additional === '') {
            this.$router.push({ name: name })
          } else {
            this.$router.push({ name: name, query: { sub: additional } })
          }
          break
        case 'category':
          this.$router.push({ name: name, params: { destination: additional } })
          break
        default:
          this.$router.push({ name: name })
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
          ? 'animate__animated animate__fadeIn duration-c-350ms delay-c-350ms'
          : 'invisible duration-c-700ms',
        leave: to.query.sub === 'adventure'
          ? 'fade-out-custom duration-c-700ms'
          : 'disappear duration-c-700ms'
      }
      this.adventureAnimation = {
        enter: from.query.sub === 'training'
          ? 'animate__animated animate__fadeIn duration-c-350ms delay-c-350ms'
          : 'invisible duration-c-700ms',
        leave: to.query.sub === 'training'
          ? 'animate__animated animate__fadeOut duration-c-350ms'
          : 'animate__animated animate__slideOutLeft duration-c-700ms'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  justify-content: space-evenly;
}
</style>
