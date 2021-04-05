import JapaneseSigns from '@/data/JapaneseSigns.json'
import GreekSigns from '@/data/GreekSigns.json'

export default {
  'japanese': {
    'signs': JapaneseSigns,
    'latinAlphabet': 'romaji',
    'foreignAlphabet': 'kana',
    'lang': ['ja-JP', 'ja_JP'],
    'flag': 'jp'
  },
  'greek': {
    'signs': GreekSigns,
    'latinAlphabet': 'pronunciation',
    'foreignAlphabet': 'euclidean',
    'lang': ['el-GR', 'el_GR'],
    'flag': 'gr'
  },
  'norwegian': {
    'signs': null,
    'latinAlphabet': 'danoNorwegian',
    'foreignAlphabet': '',
    'lang': ['nb-NO', 'nb_NO'],
    'flag': 'no'
  }
}
