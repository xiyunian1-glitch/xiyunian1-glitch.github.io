import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from '@unocss/vite'

export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    {
      name: 'force-zh-cn-html-lang',
      transformIndexHtml(html) {
        return html.replace('<html lang="en">', '<html lang="zh-CN">')
      },
    },
  ],
  ssgOptions: {
    dirStyle: 'nested',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5174,
  },
})
