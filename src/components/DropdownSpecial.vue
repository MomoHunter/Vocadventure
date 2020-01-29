<template>
  <div class="dropdown fullWidth" :class="{ 'is-active': isActive }">
    <div class="dropdown-trigger fullWidth">
      <ButtonRightIcon :text="buttonText" :color="buttonColor" :icon="buttonIcon" @click="toggleDropdown()" />
    </div>
    <div class="dropdown-menu fullWidth maxHeight overflowAuto">
      <div class="dropdown-content">
        <div v-for="(words, key) in vocabs.words" :key="key">
          <table class="table has-background-grey-darker">
            <thead>
              <tr>
                <td colspan="3" class="has-background-primary has-text-centered">{{ getText(key) }}</td>
              </tr>
            </thead>
            <tr v-for="(word, index) in words" :key="index">
              <td>{{ index + 1 }}</td>
              <td style="width:60%;">{{ word[$store.state.lang] }}</td>
              <td>{{ word[vocabs.foreignAlphabet] }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonRightIcon from '@/components/ButtonRightIcon.vue'

export default {
  name: 'DropdownSpecial',
  components: {
    ButtonRightIcon
  },
  props: {
    buttonText: String,
    buttonColor: String,
    vocabs: Object
  },
  data () {
    return {
      isActive: false
    }
  },
  computed: {
    buttonIcon () {
      return this.isActive ? 'angle-up' : 'angle-down'
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    toggleDropdown () {
      this.isActive = !this.isActive
    }
  }
}
</script>

<style lang="scss" scoped>
.maxHeight {
  max-height: 500%;
}

.overflowAuto {
  overflow: auto;
}
</style>
