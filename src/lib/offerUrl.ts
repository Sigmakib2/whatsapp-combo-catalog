/** Keep ad attribution when linking between menu and detail. */
const UTM_KEYS = ['utm_source', 'utm_campaign', 'utm_content'] as const

export function utmSearchParams(from: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams()
  for (const key of UTM_KEYS) {
    const value = from.get(key)
    if (value) next.set(key, value)
  }
  return next
}

export function pathWithUtm(path: string, from: URLSearchParams): string {
  const utm = utmSearchParams(from)
  const q = utm.toString()
  return q ? `${path}?${q}` : path
}

export function offerDetailPath(slug: string, from: URLSearchParams): string {
  return pathWithUtm(`/offer/${encodeURIComponent(slug)}`, from)
}

export function menuPath(from: URLSearchParams): string {
  return pathWithUtm('/', from)
}
