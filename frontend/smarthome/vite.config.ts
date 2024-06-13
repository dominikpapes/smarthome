import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const SMARTHOME_API = 'http://127.0.0.1:8000/smarthome/'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: SMARTHOME_API,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
