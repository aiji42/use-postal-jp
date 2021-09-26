import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/main.ts'),
      name: 'usePostalJp',
      fileName: (format) => `main.${format}.js`
    },
    rollupOptions: {
      external: ['react']
    }
  },
  plugins: [reactRefresh()]
})
