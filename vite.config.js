import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['chart.js'],
          app: ['src/js/main.js']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})