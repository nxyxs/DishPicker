import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: 5174,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  }
})
