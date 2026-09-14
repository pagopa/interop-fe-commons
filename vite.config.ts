/// <reference types="vitest" />

import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { visualizer } from 'rollup-plugin-visualizer'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

export default defineConfig({
  plugins: [
    react(),
    peerDepsExternal(),
    visualizer(),
    dts({
      insertTypesEntry: true,
      exclude: ['**/__tests__/**/*', '**/stories/**/*'],
    }),
  ],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  build: {
    sourcemap: true,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'interop-fe-commons',
      fileName: (format) => `index.${format}.js`,
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.js',
    server: {
      deps: {
        inline: ['@pagopa/mui-italia'],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
    },
  },
})
