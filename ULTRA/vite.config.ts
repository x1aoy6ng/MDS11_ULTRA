import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/history': {
        target: 'http://localhost:5027',
        changeOrigin: true,
        secure: false,
      },
      '/upload': {
        target: 'http://localhost:5027',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://localhost:5027',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
