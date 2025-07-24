import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react({
    include: "**/*.{js,jsx,ts,tsx}",
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 8080
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
  },
})