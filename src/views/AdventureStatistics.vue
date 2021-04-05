<template>
  <div class="adventure-page">
    <div class="statistics flex-grow overflow-auto">
      <div class="result flex-row border-bottom margin-bottom-medium" :class="getSizeClass('general')">
        <div class="title flex-grow">
          {{ getText(vocabs.latinAlphabet) }}
        </div>
        <div class="percentage">
          {{ percentages.latinAlphabet }}%
        </div>
      </div>
      <div v-if="hasForeignAlphabet" class="result flex-row border-bottom margin-bottom-medium"
           :class="getSizeClass('general')">
        <div class="title flex-grow">
          {{ getText(vocabs.foreignAlphabet) }}
        </div>
        <div class="percentage">
          {{ percentages.foreignAlphabet }}%
        </div>
      </div>
      <TitleBasic class="margin-bottom-mini" text="adventureStatisticsFoundItems" icon="plus" color="green" />
      <div v-if="items.length > 0" class="flex-row gap-column-small overflow-auto margin-bottom-medium">
        <ItemBoxBasic class="small" v-for="item in condensedItems" mode="small" :item="item" :key="item.id" />
      </div>
      <div v-else class="item-box-replacement margin-bottom-medium" :class="getSizeClass('general')">
        {{ getText('adventureStatisticsNoItems') }}
      </div>
      <TitleBasic class="margin-bottom-mini" text="adventureStatisticsWordTitle" icon="pen" color="info" />
      <div class="correct-word flex-column" :class="getSizeClass('general')" v-for="word in getCorrectWords()"
           :key="word.index">
        <div class="title info flex-row">
          <div class="index">
            {{ word.index + 1 }}
          </div>
          <div class="text flex-grow">
            {{ vocabs.words[word.index][vocabs.mainAlphabet] }}
          </div>
        </div>
        <div class="latin flex-row">
          <div class="icon" :class="getVocabIconColor(word.latinCorrectWords.result)">
            <font-awesome-icon :icon="['fas', getVocabIcon(word.latinCorrectWords.result)]" />
          </div>
          <div class="word flex-column flex-grow">
            <div class="own">
              {{ word.latinCorrectWords.inputValue || '-' }}
            </div>
            <div class="correct">
              {{ vocabs.words[word.index][vocabs.latinAlphabet] }}
            </div>
          </div>
        </div>
        <div v-if="hasForeignAlphabet" class="foreign flex-row">
          <div class="icon" :class="getVocabIconColor(word.foreignCorrectWords.result)">
            <font-awesome-icon :icon="['fas', getVocabIcon(word.foreignCorrectWords.result)]" />
          </div>
          <div class="word flex-column flex-grow">
            <div class="own">
              {{ word.foreignCorrectWords.inputValue || '-' }}
            </div>
            <div class="correct">
              {{ vocabs.words[word.index][vocabs.foreignAlphabet] }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-container">
      <ButtonBasic class="width-half" icon="arrow-left" color="yellow" text="adventureStatisticsButton1"
                   @click="$emit('click', { type: 'navTo', value: 'category' })" />
      <ButtonBasic class="width-half" icon="check" color="green" text="adventureStatisticsButton2"
                   @click="$emit('click', { type: 'navTo', value: 'menu' })" />
    </div>
  </div>
</template>

<script>
import ItemBoxBasic from '@/components/ItemBoxBasic.vue'
import TitleBasic from '@/components/TitleBasic.vue'
import ButtonBasic from '@/components/ButtonBasic.vue'

export default {
  name: 'AdventureStatistics',
  components: {
    ItemBoxBasic,
    TitleBasic,
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
    },
    hasForeignAlphabet () {
      return this.vocabs.foreignAlphabet !== ''
    },
    condensedItems () {
      return this.items.reduce((arr, item) => {
        let foundItem = arr.find(arrItem => arrItem.id === item.id)
        if (foundItem) {
          foundItem.quantity += item.quantity
        } else {
          arr.push(item)
        }
        return arr
      }, [])
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
          foreignCorrectWords: this.hasForeignAlphabet ? this.$store.state.vueDict.correctForeignWords[i] : {}
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
          return 'green'
        case 1:
          return 'yellow'
        default:
          return 'red'
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
.statistics {
  height: 1rem;
}
</style>
