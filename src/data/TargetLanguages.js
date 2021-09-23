import JapaneseSigns from '@/data/JapaneseSigns.json'
import GreekSigns from '@/data/GreekSigns.json'
import RussianSigns from '@/data/RussianSigns.json'

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
  },
  'german': {
    'signs': null,
    'latinAlphabet': 'german',
    'foreignAlphabet': '',
    'lang': ['de-DE', 'de_DE'],
    'flag': 'de'
  },
  'spanish': {
    'signs': null,
    'latinAlphabet': 'spanish',
    'foreignAlphabet': '',
    'lang': ['es-ES', 'es_ES'],
    'flag': 'es'
  },
  'russian': {
    'signs': RussianSigns,
    'latinAlphabet': 'pronunciation',
    'foreignAlphabet': 'cyrillic',
    'lang': ['ru-RU', 'ru_RU'],
    'flag': 'ru'
  }
}
