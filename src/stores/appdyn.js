import { defineStore } from 'pinia'

export const useAppDynStore = defineStore({
  id: 'appdyn',
  state: () => ({
    transitionActive: false,
    newUpdate: false,
    updateAvailable: false, // when automatic updates off
    updatesWillInstall: false, // when automatic updates turned on
    updateSuccess: false, // after last restart
    updateFinished: false, // when still need to restart
    categoriesChosen: [],
    wordDifficulty: 1,
    wordCount: 10,
    reversedType: false, // standard is asking for the target language, reversed is asking for the lang in adventure
    packagesDestination: '', // stores destination for packages on navigation
    activeModal: null,
    modalAnswer: '',
    trainingStash: null, // stores words when switching from training to write kanji
    writeKanji: {
      data: null, // used for defining which word was selected when switching from training
      selectedWord: [{ categoryKey: '', index: 0 }, { categoryKey: '', index: 0 }],
      selectedTab: 0,
      selectedLetter: [0, 0]
    },
    packages: {
      changed: false,
      wordpack: null,
      wordpackKey: '',
      categoryIndex: -1,
      categoriesScroll: 0,
      wordIndex: -1
    }
  }),
  getters: {
  },
  actions: {
    resetSWNotifications () {
      this.newUpdate = false
      this.updateAvailable = false
      this.updatesWillInstall = false
      this.updateSuccess = false
      this.updateFinished = false
    }
  }
})