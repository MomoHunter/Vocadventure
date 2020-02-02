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
                  <td colspan="4" class="has-background-primary has-text-centered" :class="getSizeClass('td')">
                    {{ getText(key) }}
                  </td>
                </tr>
              </thead>
              <tr v-for="(word, index) in words" :key="index">
                <td class="tenthWidth" :class="getSizeClass('td')">{{ index + 1 }}</td>
                <td class="halfWidth" :class="getSizeClass('td')">{{ word[$store.state.lang] }}</td>
                <td :class="getSizeClass('td')">{{ word[vocabs.foreignAlphabet] }}</td>
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
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
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

.is-small {
  font-size: .85em;
}

.is-medium {
  font-size: 1.25rem;
}

.is-large {
  font-size: 1.5rem;
}
</style>
