import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import vercel from '@astrojs/vercel'

const site = process.env.PUBLIC_SITE_URL || undefined
const revalidateSecret =
  process.env.REVALIDATE_SECRET || process.env.ISR_BYPASS_TOKEN

export default defineConfig({
  output: 'server',
  adapter: vercel({
    imageService: true,
    isr: revalidateSecret
      ? {
          expiration: 60,
          bypassToken: revalidateSecret,
          exclude: [/^\/api\/.+/],
        }
      : {
          expiration: 60,
          exclude: [/^\/api\/.+/],
        },
  }),
  site,
  integrations: [react()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  image: {
    domains: ['cdn.sanity.io'],
  },
})
