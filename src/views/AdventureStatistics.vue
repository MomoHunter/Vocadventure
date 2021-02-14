<template>
  <div class="flexboxContainer">
    <!-- <div class="itemContainer" v-if="items.length > 0">
      <ItemBoxSmall :item="item" v-for="item in items" :key="item.id" />
    </div>
    <div class="noItemsContainer" v-else>
      {{ getText('adventureStatisticsNoItems') }}
    </div> -->
    <div class="is-10 box resultBox marginBottomSmall">
      <div class="innerResultBox">
        <span class="content flexGrow noMarginBottom">
          {{ getText(vocabs.latinAlphabet) }}
        </span>
        <span class="content noMarginBottom">
          {{ percentages.latinAlphabet }}%
        </span>
      </div>
      <div class="innerResultBox">
        <span class="content flexGrow marginTopSmall noMarginBottom">
          {{ getText(vocabs.foreignAlphabet) }}
        </span>
        <span class="content marginTopSmall noMarginBottom">
          {{ percentages.foreignAlphabet }}%
        </span>
      </div>
    </div>
    <div class="is-10 flexGrow">
      <ButtonBasic icon="clipboard-list" color="is-info" text="adventureStatisticsButton3" @click="showDetails()" />
    </div>
    <div class="is-10">
      <ButtonBasic class="marginBottomSmall" icon="arrow-left" color="is-warning" text="adventureStatisticsButton1"
                   @click="$emit('click', { type: 'navTo', value: 'category' })" />
      <ButtonBasic icon="check" color="is-success" text="adventureStatisticsButton2"
                   @click="$emit('click', { type: 'navTo', value: 'menu' })" />
    </div>
    <transition enter-active-class="animated fadeInUp a-little-bit-faster"
                leave-active-class="animated fadeOutDown a-little-bit-faster is-absolute">
      <div v-show="detailsVisible" class="detailsContainer has-background-grey-lighter">
        <div class="itemContainer marginBottomBig" v-if="items.length > 0">
          <ItemBoxSmall :item="item" v-for="item in items" :key="item.id" />
        </div>
        <div class="noItemsContainer marginBottomBig" v-else>
          {{ getText('adventureStatisticsNoItems') }}
        </div>
        <div class="is-10 flexGrow overflowAuto marginBottomBig">
          <table class="table fullWidth">
            <tbody v-for="word in getCorrectWords()" :key="word.index">
              <tr>
                <td colspan="2" class="has-background-primary has-text-black" :class="getSizeClass('td')">
                  {{ vocabs.words[word.index][vocabs.mainAlphabet] }}
                </td>
              </tr>
              <tr>
                <td rowspan="2" class="vAlign" :class="getSizeClass('td')">
                  <font-awesome-icon :class="getVocabIconColor(word.latinCorrectWords.result)"
                                     :icon="['fas', getVocabIcon(word.latinCorrectWords.result)]"
                                     :size="getSizeClass('fas')" />
                </td>
                <td class="fullWidth" :class="getSizeClass('td')">
                  {{ vocabs.words[word.index][vocabs.latinAlphabet] }}
                </td>
              </tr>
              <tr>
                <td class="fullWidth" :class="getSizeClass('td')">
                  {{ word.latinCorrectWords.inputValue || '-' }}
                </td>
              </tr>
              <tr>
                <td rowspan="2" class="vAlign" :class="getSizeClass('td')">
                  <font-awesome-icon :class="getVocabIconColor(word.foreignCorrectWords.result)"
                                     :icon="['fas', getVocabIcon(word.foreignCorrectWords.result)]"
                                     :size="getSizeClass('fas')" />
                </td>
                <td class="fullWidth" :class="getSizeClass('td')">
                  {{ vocabs.words[word.index][vocabs.foreignAlphabet] }}
                </td>
              </tr>
              <tr>
                <td class="fullWidth" :class="getSizeClass('td')">
                  {{ word.foreignCorrectWords.inputValue || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="is-10">
          <ButtonBasic icon="times" color="is-danger" text="adventureStatisticsDetailsButton1" @click="hideDetails()" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import ItemBoxSmall from '@/components/ItemBoxSmall.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'AdventureStatistics',
  components: {
    ItemBoxSmall,
    ButtonBasic
  },
  data () {
    return {
      detailsVisible: false
    }
  },
  computed: {
    items () {
      return this.$store.state.canvasDict.collectedItems
    },
    percentages () {
      return {
        latinAlphabet: this.getPercentage(this.$store.state.vueDict.correctLatinWords),
        foreignAlphabet: this.getPercentage(this.$store.state.vueDict.correctForeignWords)
      }
    },
    vocabs () {
      return this.$store.state.vueDict.vocabs
    }
  },
  methods: {
    getText (id) {
      return this.$store.getters.getText(id)
    },
    getSizeClass (type) {
      return this.$store.getters.getSizeClass(type)
    },
    getCorrectWords () {
      var result = []
      for (let i = 0; i < this.vocabs.words.length; i++) {
        result.push({
          index: i,
          latinCorrectWords: this.$store.state.vueDict.correctLatinWords[i],
          foreignCorrectWords: this.$store.state.vueDict.correctForeignWords[i]
        })
      }
      return result
    },
    getPercentage (values) {
      return (values.reduce((result, value) => {
        switch (value.result) {
          case 2:
            return result + 1
          case 1:
            return result + 0.5
          default:
            return result
        }
      }, 0) / values.length * 100).toFixed(2)
    },
    getVocabIcon (result) {
      if (result === 0) {
        return 'times'
      } else {
        return 'check'
      }
    },
    getVocabIconColor (result) {
      switch (result) {
        case 2:
          return 'has-text-success'
        case 1:
          return 'has-text-warning'
        default:
          return 'has-text-danger'
      }
    },
    showDetails () {
      this.detailsVisible = true
    },
    hideDetails () {
      this.detailsVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.flexboxContainer {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  padding-bottom: 71px;

  .is-10 {
    width: calc(100% / 1.2);
  }

  .flexGrow {
    flex-grow: 1;
  }

  .overflowAuto {
    overflow: auto;
  }

  .resultBox {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    padding: 1rem;

    .innerResultBox {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
    }
  }

  .detailsContainer {
    position: absolute;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    width: 100%;
    height: calc(100% + .5rem);
    padding-top: 1.5rem;
    padding-bottom: 71px;
    top: 0px;
    z-index: 4;

    .vAlign {
      vertical-align: middle;
    }

    .table tbody tr:last-child td {
      border-bottom-width: 1px !important;
    }
  }

  .itemContainer {
    display: flex;
    min-height: 16%;
    max-width: calc(100% / 1.2);
    overflow: auto;

    > :not(:last-child) {
      margin-right: .5rem;
    }
  }
}
</style>
