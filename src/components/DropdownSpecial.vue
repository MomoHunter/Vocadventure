<template>
  <div class="dropdown fullWidth" :class="{ 'is-active': isActive }">
    <div class="dropdown-trigger fullWidth">
      <ButtonRightIcon :text="buttonText" :color="buttonColor" :icon="buttonIcon" @click="toggleDropdown()" />
    </div>
    <div class="dropdown-menu fullWidth">
      <div class="dropdown-content customPadding">
        <div class="maxHeight overflowAuto">
          <div>
            <table class="table fullWidth" v-for="(words, key) in vocabs.words" :key="key">
              <thead>
                <tr class="headerSticky">
                  <td colspan="4" class="has-background-primary has-text-centered">{{ getText(key) }}</td>
                </tr>
              </thead>
              <tr v-for="(word, index) in words" :key="index">
                <td class="tenthWidth">{{ index + 1 }}</td>
                <td class="halfWidth">{{ word[$store.state.lang] }}</td>
                <td>{{ word[vocabs.foreignAlphabet] }}</td>
                <td class="tenthWidth is-paddingless">
                  <ButtonIcon color="is-success" icon="arrow-right"
                              @click="selectWord(key, index)" />
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonRightIcon from '@/components/ButtonRightIcon.vue'
import ButtonIcon from '@/components/ButtonIcon.vue'

export default {
  name: 'DropdownSpecial',
  components: {
    ButtonRightIcon,
    ButtonIcon
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
    selectWord (category, index) {
      this.$emit('click', { category: category, index: index })
      this.toggleDropdown()
    },
    toggleDropdown () {
      this.isActive = !this.isActive
    }
  }
}
</script>

<style lang="scss" scoped>
.maxHeight {
  max-height: 20rem;
}

.overflowAuto {
  overflow: auto;
}

.headerSticky td {
  position: sticky;
  top: 0px;
  z-index: 20;
}

.customPadding {
  padding: .5rem;
}

.tenthWidth {
  width: 10%;
}

.halfWidth {
  width: 50%;
}
</style>
