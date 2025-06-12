import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import AutoImports from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { dirResolver, DirResolverHelper } from 'vite-auto-import-resolvers'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VantResolver } from '@vant/auto-import-resolver'
import vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import Layouts from 'vite-plugin-vue-layouts'
import axios from 'axios';

// https://vitejs.dev/config/

export default defineConfig({
  base: '/RuRuQuestions/',
  plugins: [
    vue(),
    // 该辅助插件也是必需的 👇
    Pages(),
    Layouts(),
    DirResolverHelper(),
    AutoImports({
      imports: ['vue'],
      resolvers: [dirResolver(), ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0', // 显示IP位置
  }
})

