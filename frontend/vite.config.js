/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  },
  // Vitest — ทดสอบด้วย jsdom (จำลองเบราว์เซอร์) ดูรายละเอียดใน README หัวข้อ "การทดสอบ"
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: { modules: { classNameStrategy: 'non-scoped' } },
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/test/**', 'src/**/*.test.{js,jsx}'],
      // เกณฑ์ขั้นต่ำเฉพาะตรรกะหลัก (CI ล้มถ้า coverage ต่ำกว่านี้)
      thresholds: {
        'src/utils/**': { lines: 90, functions: 90 },
        'src/data/**': { lines: 90, functions: 90 },
        'src/context/**': { lines: 70, functions: 60 },
      },
    },
  },
})
