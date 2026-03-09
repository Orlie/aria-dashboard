# Agent Task: Batch 1A — Quick Fixes + PWA Service Worker

**BATCH 1 — Run simultaneously with Batch 1B and Batch 1C (no file conflicts)**

---

## Project Context

You are working on **ARIA Dashboard** — a React 19 + TypeScript + Vite app for a TikTok Shop Live Selling Agency.
Project root: `c:\Users\Orlie\OneDrive\Desktop\LIVE SELLING AGENCY`

Tech stack: React 19, TypeScript, Vite, Zustand (state), Recharts (charts), Lucide React (icons), custom CSS (no Tailwind).
CSS uses variables like `--aria-yellow`, `--aria-bg`, `--aria-card-bg`, `--aria-green`, `--aria-red`, `--aria-white`, `--aria-gray-text`.

---

## Your Tasks

### Task 1: Fix GapAnalysis Currency Bug
`src/components/revenue/GapAnalysis.tsx` shows "₱1M" (Philippine peso) but the business target is USD ($1M). Every other component uses USD formatting. Fix all peso references to USD.

**Steps:**
1. Read `src/components/revenue/GapAnalysis.tsx`
2. Find all instances of `₱` symbol and replace with `$`
3. Find any hardcoded "₱1M", "₱1,000,000", "₱83,333" style text and replace with USD equivalents
4. Also check for any "PHP" or "Philippine" text that should be USD
5. Do NOT change any business logic — only fix currency display

---

### Task 2: Register PWA Service Worker

The app has `public/manifest.json` and `public/icons/` set up but no service worker. Add `vite-plugin-pwa` so ARIA can be installed as a home screen app on iPhone.

**Steps:**

1. Read `package.json` to see current dependencies and scripts
2. Read `vite.config.ts` to see current config
3. Add `vite-plugin-pwa` to `devDependencies` in `package.json` — add version `^0.21.0` or latest compatible with Vite
4. Read `public/manifest.json` to understand current manifest config
5. Update `vite.config.ts` to register the PWA plugin:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'ARIA Dashboard',
        short_name: 'ARIA',
        description: 'Live Selling Agency CRM',
        theme_color: '#0a0a0a',
        background_color: '#0a0a0a',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ],
})
```

6. Run `npm install` to install the new package

---

### Task 3: Create `.env.example`

There is a `.env` file with Google credentials but no `.env.example` for documentation. Create one at the project root.

**Create `c:\Users\Orlie\OneDrive\Desktop\LIVE SELLING AGENCY\.env.example`:**

```
# Google Sheets Integration
# Get these from: https://console.cloud.google.com/
# 1. Create a new project
# 2. Enable Google Sheets API
# 3. Create OAuth 2.0 credentials (Web application type)
# 4. Add your domain to authorized origins
VITE_GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
VITE_GOOGLE_API_KEY=your-api-key-here

# For local development, add http://localhost:5173 to authorized origins
# For production, add your Vercel deployment URL
```

---

## Done Criteria

- [ ] `GapAnalysis.tsx` shows `$` not `₱` everywhere
- [ ] `vite.config.ts` has VitePWA plugin configured
- [ ] `package.json` has `vite-plugin-pwa` in devDependencies
- [ ] `npm install` ran successfully (no errors)
- [ ] `.env.example` exists at project root with documented vars
- [ ] Run `npm run build` and confirm it succeeds with no errors
