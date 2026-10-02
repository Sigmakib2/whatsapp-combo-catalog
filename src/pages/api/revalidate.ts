import { getCatalog } from '../../lib/content.ts'

export const prerender = false

/**
 * Sanity webhook target for near-instant catalog updates on Vercel.
 *
 * Env:
 *   REVALIDATE_SECRET   — shared secret (Sanity header / ?secret=) and ISR bypass token
 *   PUBLIC_SITE_URL     — https://your-domain (no trailing slash); falls back to VERCEL_URL
 *
 * Sanity webhook: POST this URL, Drafts off, filter offer + siteSettings.
 */
function siteBase(): string | undefined {
  const configured =
    import.meta.env.PUBLIC_SITE_URL || process.env.PUBLIC_SITE_URL
  if (configured) return configured.replace(/\/$/, '')
  const vercel =
    process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, '')}`
  return undefined
}

export async function POST({ request }: { request: Request }) {
  const url = new URL(request.url)
  const headerSecret = request.headers.get('x-revalidate-secret')
  const querySecret = url.searchParams.get('secret')
  const expected =
    import.meta.env.REVALIDATE_SECRET || process.env.REVALIDATE_SECRET

  if (!expected || (headerSecret !== expected && querySecret !== expected)) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const base = siteBase()
  if (!base) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Set PUBLIC_SITE_URL (or deploy on Vercel so VERCEL_URL exists).',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const paths = ['/']
  try {
    const catalog = await getCatalog()
    for (const offer of catalog.offers) {
      paths.push(`/offer/${encodeURIComponent(offer.slug)}`)
    }
  } catch {
    // Still revalidate the menu if catalog fetch fails.
  }

  const results: { path: string; status: number }[] = []
  for (const path of paths) {
    const target = new URL(path, `${base}/`)
    const res = await fetch(target, {
      method: 'HEAD',
      headers: {
        'x-prerender-revalidate': expected,
      },
    })
    results.push({ path, status: res.status })
  }

  return new Response(JSON.stringify({ ok: true, revalidated: paths, results }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export async function GET() {
  return new Response(
    JSON.stringify({
      ok: true,
      hint: 'POST with x-revalidate-secret or ?secret= to revalidate the catalog cache',
    }),
    { status: 200, headers: { 'Content-Type': 'application/json' } },
  )
}
