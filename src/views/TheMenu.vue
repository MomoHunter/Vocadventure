<template>
  <div class="page">
    <HeroBasic title="menuTitle" :subtitle="subtitleText" />
    <div class="menu-button-container width-full relative" :class="getSizeClass('general')">
      <div class="width-full absolute">
        <transition :enter-active-class="trainingAnimation.enter"
                    :leave-active-class="trainingAnimation.leave">
          <ButtonBasic v-show="isVisible(1)" class="menu width-half" color="info" icon="book" text="menuButton1"
                       @click="navTo('menu', 'training')" :disabled="buttonsDisabled" />
        </transition>
        <transition :enter-active-class="adventureAnimation.enter"
                    :leave-active-class="adventureAnimation.leave">
          <ButtonBasic v-show="isVisible(1)" class="menu width-half" color="green" icon="gem" text="menuButton2"
                       @click="navTo('menu', 'adventure')" :disabled="buttonsDisabled" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(1)" class="menu width-full" color="settings" icon="cog" text="menuButton3"
                       @click="navTo('settings')" :disabled="buttonsDisabled" />
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
          <ButtonBasic v-show="isVisible(2) && isJapanese" class="menu width-half" color="info-2" icon="pen"
                       text="menuTrainingButton2" @click="navTo('category', 'writeKanji')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(2) && isJapanese" class="menu width-half" color="red" icon="arrow-left"
                       text="menuTrainingButton3" @click="navTo('menu')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(2)" class="menu width-half" color="green-light" icon="search"
                       text="menuTrainingButton4" @click="navTo('dictionary')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(2) && !isJapanese" class="menu width-full" color="red" icon="arrow-left"
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
          <ButtonBasic v-show="isVisible(3)" class="menu width-half" color="yellow" icon="award"
                       text="menuAdventureButton2" @click="navTo('achievements')" />
        </transition>
        <transition enter-active-class="animate__animated animate__fadeIn duration-c-350ms delay-c-350ms"
                    leave-active-class="animate__animated animate__fadeOut duration-c-350ms">
          <ButtonBasic v-show="isVisible(3)" class="menu width-full" color="red" icon="arrow-left"
                       text="menuAdventureButton3" @click="navTo('menu')" />
        </transition>
      </div>
    </div>
    <transition enter-active-class="animate__animated animate__backInUp duration-c-700ms"
                leave-active-class="animate__animated animate__backOutDown duration-c-700ms"
                @after-leave="resetNotification()">
      <NotificationBasic v-show="notificationVisible" title="menuNotificationTitle" :text="updateText"
                         :color="updateColor" :icon="updateIcon" :spin="updateIcon === 'cog'"
                         @click="hideNotification()" />
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
      notificationVisible: false,
      blockReset: false,
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
  mounted () {
    if (this.updateText[0] !== '') {
      this.showNotification()
    }
  },
  computed: {
    isJapanese () {
      return this.$store.state.targetLanguage === 'japanese'
    },
    subtitleText () {
      return ['menuSubtitle', this.$store.state.targetLanguage]
    },
    updateText () {
      if (this.$store.state.updateFinished) {
        return ['menuNotificationUpdateFinished']
      } else if (this.$store.state.newUpdate) {
        return ['menuNotificationNewUpdate']
      } else if (this.$store.state.updatesWillInstall) {
        return ['menuNotificationUpdatesWillInstall']
      } else if (this.$store.state.updateAvailable) {
        return ['menuNotificationUpdateAvailable']
      } else if (this.$store.state.updateSuccess) {
        return ['menuNotificationUpdateSuccess']
      }
      return ['']
    },
    updateIcon () {
      if (this.$store.state.updateFinished || this.$store.state.updateSuccess) {
        return 'check-square'
      } else if (this.$store.state.updateAvailable || this.$store.state.updatesWillInstall) {
        return 'info'
      }
      return 'cog'
    },
    updateColor () {
      if (this.$store.state.updateAvailable || this.$store.state.updatesWillInstall) {
        return 'yellow'
      }
      return 'green'
    },
    buttonsDisabled () {
      return this.$store.state.newUpdate && this.$store.state.missedUpdates
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
    showNotification () {
      this.notificationVisible = true
    },
    hideNotification () {
      this.notificationVisible = false
    },
    resetNotification () {
      if (!this.blockReset) {
        this.$store.commit('swReset')
      } else {
        this.blockReset = false
      }
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
    },
    updateText (to, from) {
      if (to[0] !== '') {
        if (from[0] !== '' && !this.notificationVisible) {
          this.blockReset = true
        }
        this.showNotification()
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
