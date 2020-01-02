<template>
  <div class="flexContainer">
    <TheHero title="settingsTitle" />
    <div class="is-10 flexGrow">
      <DropdownBasic class="marginBottomSmall" icon="globe" :options="languages"
                     :selected="(sel) => sel === $store.state.lang" @change="changeValue('newLanguage', $event)" />
      <DropdownBasic class="marginBottomSmall" icon="palette" :options="themes"
                     :selected="(sel) => sel === $store.state.theme" @change="changeValue('newTheme', $event)" />
      <DropdownBasic class="marginBottomSmall" icon="expand-arrows-alt" :options="sizes"
                     :selected="(sel) => sel === $store.state.size" @change="changeValue('newSize', $event)" />
      <ButtonBasic class="marginBottomSmall" color="is-danger" icon="trash" text="settingsButtonDelete"
                   @click="$store.commit('showModal')" />
    </div>
    <div class="is-10">
      <ButtonBasic class="marginBottomSmall" color="is-success" icon="check" text="settingsButton1"
                   @click="submitChanges()" />
      <ButtonBasic class="marginBottomSmall" color="is-danger" icon="arrow-left" text="settingsButton2"
                   @click="$router.push({ name: 'menu' })" />
    </div>
  </div>
</template>

<script>
import Texts from '@/data/Texts.json'
import TheHero from '@/components/TheHero.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'
import DropdownBasic from '@/components/DropdownBasic.vue'

export default {
  name: 'TheSettings',
  components: {
    TheHero,
    ButtonBasic,
    DropdownBasic
  },
  data () {
    return {
      newLanguage: this.$store.state.lang,
      newTheme: this.$store.state.theme,
      newSize: this.$store.state.size
    }
  },
  computed: {
    languages () {
      return Object.keys(Texts)
    },
    themes () {
      return ['bulma', 'darkly', 'cerulean']
    },
    sizes () {
      return ['small', 'normal', 'medium', 'large']
    }
  },
  methods: {
    changeValue (variable, value) {
      this[variable] = value
    },
    submitChanges () {
      this.$store.commit('changeLanguage', this.newLanguage)
      this.$store.commit('changeTheme', this.newTheme)
      this.$store.commit('changeSize', this.newSize)
    }
  }
}
</script>

<style lang="scss" scoped>
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

  div {
    margin-top: 1rem;
  }

  .is-10 {
    width: calc(100% / 1.2);
  }

  .flexGrow {
    flex-grow: 1;
  }
}
</style>
