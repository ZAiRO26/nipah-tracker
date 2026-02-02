// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://nipahtracker.online',
  integrations: [react(), sitemap()],
  output: 'server',

  vite: {
    plugins: [
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'NiV-Tracker 2026',
          short_name: 'NiV-Tracker',
          description: 'Real-time Nipah Virus Surveillance & Safety Platform',
          theme_color: '#ffffff',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: '/favicon.svg',
              sizes: '192x192',
              type: 'image/svg+xml'
            },
            {
              src: '/favicon.svg',
              sizes: '512x512',
              type: 'image/svg+xml'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
          runtimeCaching: [
            {
              // Cache Safety and About pages for offline access
              urlPattern: ({ url }) => {
                return url.pathname.startsWith('/safety') || url.pathname.startsWith('/about');
              },
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'safety-content',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 30 // 30 Days
                }
              }
            }
          ]
        }
      })
    ]
  },

  adapter: netlify()
});