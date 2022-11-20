import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import filePlugin from './plugins/viteFilePlugin'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    base: mode === 'production' ? '/Vocadventure/' : '/',
    plugins: [
      vue(),
      filePlugin({
        path: 'files.js',
        serialize: (list) => {
          return 'var FILES = ' + JSON.stringify(list, null, 2)
        }
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})
