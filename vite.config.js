import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index:        resolve(__dirname, 'index.html'),
        utility:      resolve(__dirname, 'utility.html'),
        rewards:      resolve(__dirname, 'rewards.html'),
        roadmap:      resolve(__dirname, 'roadmap.html'),
        presales:     resolve(__dirname, 'presales.html'),
        dyor:         resolve(__dirname, 'dyor.html'),
        dex:          resolve(__dirname, 'dex.html'),
        builder:      resolve(__dirname, 'builder.html'),
        audit:        resolve(__dirname, 'audit.html'),
        airdrop:      resolve(__dirname, 'airdrop.html'),
        locker:       resolve(__dirname, 'locker.html'),
        analytics:    resolve(__dirname, 'analytics.html'),
        kyc:          resolve(__dirname, 'kyc.html'),
        'rewards-terms': resolve(__dirname, 'rewards-terms.html'),
      }
    }
  },
  server: {
    proxy: {
      '/api/lp-growth': {
        target: 'http://localhost:5173',
        rewrite: () => '/lp-growth.json',
      },
      '/api/rewards-history': {
        target: 'http://localhost:5173',
        rewrite: () => '/rewards-history.json',
      }
    }
  }
})
