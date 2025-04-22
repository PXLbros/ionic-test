import legacy from '@vitejs/plugin-legacy'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/theme/colors" as *;`,
      }
    }
  },
  plugins: [
    vue(),
    legacy(),
    Components({
      dirs: [
        'src/components',
        'src/composables',
        'src/stores',
      ], // Specify where your components live
      extensions: ['vue'],      // File extensions to look for
      deep: true,               // Include subdirectories
      dts: 'src/components.d.ts' // Generate TypeScript definitions
    }),
    // Automatically import utilities like ref, computed, etc.
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        'pinia',
      ],
      dirs: [
        'src/stores',
      ],
      dts: 'src/auto-imports.d.ts' // Generate TypeScript definitions
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
