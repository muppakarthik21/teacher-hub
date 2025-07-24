import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx|tsx|js|ts)$/,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080
  },
  esbuild: {
    include: /\.(jsx|tsx|js|ts)$/,
    exclude: [],
    loader: 'jsx',
  }
})