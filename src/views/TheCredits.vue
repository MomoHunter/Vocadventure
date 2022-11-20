<template>
  <div class="page">
    <TheHero title="creditsTitle" />
    <div class="flex-grow overflow-auto">
      <div v-for="(section, sectionIndex) in creditData" :key="sectionIndex">
        <TheTitle class="margin-top-small margin-bottom-mini" :text="section.title" :icon="section.fa" />
        <div class="section-text margin-bottom-medium" :class="getSizeClass('general')">
          <div v-for="(item, itemIndex) in section.items" :key="itemIndex">
            <div class="flex-row">
              <Icon v-if="item.leftIcon.fa" :icon="item.leftIcon.fa" :color="item.leftIcon.color"
                    :type="item.leftIcon.type" :is-gradient="item.leftIcon.isGradient" />
              <Icon v-else :color="item.leftIcon.color">
                <component :is="item.leftIcon.other" />
              </Icon>
              <div class="flex-grow">
                {{ getText(item.title) }}
              </div>
              <Icon :color="item.rightIcon.color" :icon="item.rightIcon.fa" :link="item.rightIcon.link" />
            </div>
            <div class="subtext">
              {{ getText(item.text) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-container">
      <ButtonBasic class="width-full" color="red" icon="arrow-left" text="creditsButton1" @click="navTo('settings')" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

import TheHero from '@/components/TheHero.vue'
import TheTitle from '@/components/TheTitle.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import Icon from '@/components/Icon.vue'
import MDIIconVectorSquare from '@/components/MDIIconVectorSquare.vue'
import IconVue from '@/components/IconVue.vue'
import IconPinia from '@/components/IconPinia.vue'
import IconViteJs from '@/components/IconViteJs.vue'
import IconSass from '@/components/IconSass.vue'
import MDIIconIdeogramCjk from '@/components/MDIIconIdeogramCjk.vue'

import { useAppConstStore } from '@/stores/appconst'

const router = useRouter()
const appConst = useAppConstStore()

const creditData = [
  {
    title: 'creditsTitleDevelopment',
    fa: 'code',
    items: [
      {
        leftIcon: {
          fa: 'keyboard',
          color: 'credits-keyboard'
        },
        rightIcon: {
          fa: 'arrow-up-right-from-square',
          color: 'action',
          link: 'https://github.com/MomoHunter'
        },
        title: 'MomoHunter',
        text: 'Hier stehen ein paar erklärende Worte zur Entwicklung und was der kek beigetragen hat'
      },
      {
        leftIcon: {
          fa: 'paintbrush',
          color: 'credits-brush',
          isGradient: true
        },
        rightIcon: {
          fa: 'arrow-up-right-from-square',
          color: 'action',
          link: 'https://www.instagram.com/karasophe/'
        },
        title: 'karasophe',
        text: 'Hier stehen ein paar erklärende Worte zur Entwicklung und was die kek beigetragen hat'
      }
    ]
  },
  {
    title: 'creditsTitleTech',
    fa: 'wrench',
    items: [
      {
        leftIcon: {
          other: IconVue
        },
        rightIcon: {
          fa: 'arrow-up-right-from-square',
          color: 'action',
          link: 'https://vuejs.org'
        },
        title: 'Vue 3',
        text: 'Das grundlegende Framework für die App.'
      },
      {
        leftIcon: {
          other: IconPinia
        },
        rightIcon: {
          fa: 'arrow-up-right-from-square',
          color: 'action',
          link: 'https://pinia.vuejs.org'
        },
        title: 'Pinia',
        text: 'Ein Store für Vue 3.'
      },
      {
        leftIcon: {
          other: IconViteJs
        },
        rightIcon: {
          fa: 'arrow-up-right-from-square',
          color: 'action',
          link: 'https://vitejs.dev'
        },
        title: 'Vite',
        text: 'Das Build-Tool für Vue 3.'
      },
      {
        leftIcon: {
          other: IconSass
        },
        rightIcon: {
          fa: 'arrow-up-right-from-square',
          color: 'action',
          link: 'https://sass-lang.com'
        },
        title: 'Sass',
        text: 'Ein Framework für einfacheres CSS.'
      },
      {
        leftIcon: {
          fa: 'meteor',
          color: 'red-dark'
        },
        rightIcon: {
          fa: 'arrow-up-right-from-square',
          color: 'action',
          link: 'https://animate.style'
        },
        title: 'Animate.css',
        text: 'Ein CSS-Framework für viele verschiedene Animationen.'
      }
    ]
  },
  {
    title: 'creditsTitleIcons',
    fa: 'icons',
    items: [
      {
        leftIcon: {
          fa: 'font-awesome',
          color: 'info-2'
        },
        rightIcon: {
          fa: 'arrow-up-right-from-square',
          color: 'action',
          link: 'https://fontawesome.com'
        },
        title: 'Font Awesome',
        text: 'Die Hauptquelle für die vielen Icons, die hier genutzt werden.'
      },
      {
        leftIcon: {
          other: MDIIconVectorSquare
        },
        rightIcon: {
          fa: 'arrow-up-right-from-square',
          color: 'action',
          link: 'https://materialdesignicons.com'
        },
        title: 'Material Design Icons',
        text: 'Falls ein Icon nicht in Font Awesome existiert, wird es von dieser Quelle bezogen. Insgesamt sind es aber nur wenige Icons, die hierher kommen.'
      }
    ]
  },
  {
    title: 'creditsTitleWords',
    fa: 'language',
    items: [
      {
        leftIcon: {
          fa: 'book',
          color: 'green-light'
        },
        rightIcon: {
          fa: 'arrow-up-right-from-square',
          color: 'action',
          link: 'http://freedict.org/'
        },
        title: 'Free Dict',
        text: 'Free Dict wurde für die norwegische Sprache benutzt.'
      },
      {
        leftIcon: {
          other: MDIIconIdeogramCjk
        },
        rightIcon: {
          fa: 'arrow-up-right-from-square',
          color: 'action',
          link: 'https://kanjivg.tagaini.net/index.html'
        },
        title: 'KanjiVG',
        text: 'Eine super Quelle von Vektor Grafiken von Kanjis.'
      }
    ]
  }
]

function getText(id) {
  return appConst.getText(id)
}

function getSizeClass (type) {
  return appConst.getSizeClass(type)
}

function navTo (name) {
  switch (name) {
    default:
      router.push({ name: name })
  }
}
</script>

<style lang="scss" scoped>

</style>
