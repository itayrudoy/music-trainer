import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://itayrudoy.github.io/music-trainer/
  base: '/music-trainer/',
  plugins: [react()],
})
