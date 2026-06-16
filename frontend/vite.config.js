import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three') || id.includes('@react-three')) return 'three';
            if (id.includes('firebase')) return 'firebase';
            if (id.includes('framer-motion')) return 'framer';
            if (id.includes('@xyflow')) return 'flow';
            return 'vendor';
          }
        }
      }
    }
  }
})
