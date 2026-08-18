import { defineConfig, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
      open: false,
    }) as PluginOption,
  ],
  build: {
    rollupOptions: {
      output: {
        advancedChunks: {
          groups: [
            { name: 'react', test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/ },
            { name: 'redux', test: /[\\/]node_modules[\\/](@reduxjs[\\/]toolkit|react-redux|redux|redux-thunk|reselect|immer)[\\/]/ },
            { name: 'chakra', test: /[\\/]node_modules[\\/](@chakra-ui|@emotion)[\\/]/ },
            { name: 'anim', test: /[\\/]node_modules[\\/](gsap)[\\/]/ },
          ],
        },
      } as never,
    },
  },
})
