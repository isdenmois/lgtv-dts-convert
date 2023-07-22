import { join } from 'path'
import fs from 'fs'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { presetUno } from 'unocss'
import tsconfigPaths from 'vite-tsconfig-paths'

const rendererAlias = {}

fs.readdirSync(join(__dirname, './src/renderer/src'), { withFileTypes: true })
  .filter((file) => file.isDirectory())
  .map((dir) => dir.name)
  .forEach((dir) => {
    rendererAlias[dir] = join(__dirname, `./src/renderer/src/${dir}`)
  })

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: rendererAlias,
    },
    plugins: [
      vue(),
      UnoCSS({
        presets: [presetUno()],
      }),
      tsconfigPaths(),
    ],
  },
})
