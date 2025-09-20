import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.PNG', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.bmp', '**/*.json'],
  server: {
    watch: {
      ignored: [
        '**/public/**/*.jpeg',
        '**/public/**/*.jpg',
        '**/public/**/*.png'
      ],
    },
    fs: {
      strict: false,
    },
  }
});