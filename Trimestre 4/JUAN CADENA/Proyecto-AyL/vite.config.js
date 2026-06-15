import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    https: {
      key: fs.readFileSync('./certs/localhost.key'),
      cert: fs.readFileSync('./certs/localhost.crt')
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5173',
        changeOrigin: true
      }
    }
  }
})