import {
  buildWhatsAppUrl,
  composeInquiryListText,
  composeInquiryText,
} from '../lib/whatsapp.ts'
import type { InquiryLine, OfferType, UtmParams } from '../lib/types.ts'

const STORAGE_KEY = 'packaging-inquiry-slugs'
const MAX_ITEMS = 12

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
  }
}

function readUtm(): UtmParams {
  const params = new URLSearchParams(window.location.search)
  return {
    source: params.get('utm_source') ?? undefined,
    campaign: params.get('utm_campaign') ?? undefined,
    content: params.get('utm_content') ?? undefined,
  }
}

function readSlugs(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is string => typeof item === 'string')
  } catch {
    return []
  }
}

function writeSlugs(slugs: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs.slice(0, MAX_ITEMS)))
}

function root(): HTMLElement | null {
  return document.getElementById('catalog-root')
}

function applyHighlight() {
  const params = new URLSearchParams(window.location.search)
  const slug = params.get('offer') ?? params.get('combo')
  if (!slug) return
  const card = document.querySelector<HTMLElement>(`[data-offer="${CSS.escape(slug)}"]`)
  if (!card) return
  card.dataset.highlight = 'true'
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}

function applyTypeFilter(filter: 'all' | 'combo' | 'product') {
  const cards = document.querySelectorAll<HTMLElement>('article.offer-card[data-offer-type]')
  let visible = 0
  for (const card of cards) {
    const type = card.dataset.offerType
    const show = filter === 'all' || type === filter
    card.hidden = !show
    if (show) visible += 1
  }

  const empty = document.querySelector<HTMLElement>('[data-filter-empty-msg]')
  if (empty) empty.hidden = visible > 0

  for (const btn of document.querySelectorAll<HTMLButtonElement>(
    '#type-filter [data-type-filter]',
  )) {
    const active = btn.dataset.typeFilter === filter
    btn.setAttribute('aria-pressed', active ? 'true' : 'false')
    btn.classList.toggle('type-filter__btn--active', active)
  }

  const catalog = root()
  if (catalog) catalog.dataset.offerFilter = filter
}

function revealTypeFilter() {
  const filter = document.getElementById('type-filter')
  if (!filter || !isMenuPage()) return
  filter.hidden = false

  const params = new URLSearchParams(window.location.search)
  const raw = params.get('type')
  const initial =
    raw === 'combo' || raw === 'product' || raw === 'all' ? raw : 'all'
  applyTypeFilter(initial)
}

function isMenuPage(): boolean {
  return root()?.dataset.page === 'menu'
}

function isDetailPage(): boolean {
  return root()?.dataset.page === 'detail'
}

function onTypeFilterClick(button: HTMLButtonElement) {
  const value = button.dataset.typeFilter
  if (value !== 'all' && value !== 'combo' && value !== 'product') return
  applyTypeFilter(value)

  const url = new URL(window.location.href)
  if (value === 'all') url.searchParams.delete('type')
  else url.searchParams.set('type', value)
  window.history.replaceState({}, '', url)
}

function rewriteInquireLinks(utm: UtmParams) {
  const hasUtm = Boolean(utm.source || utm.campaign || utm.content)
  if (!hasUtm) return

  for (const link of document.querySelectorAll<HTMLAnchorElement>('[data-whatsapp]')) {
    const number = link.dataset.whatsappNumber
    const text = link.dataset.whatsappText
    const name = link.dataset.comboName
    if (!number || !text || !name) continue
    link.href = buildWhatsAppUrl(number, composeInquiryText(text, name, utm))
  }
}

function revealAddButtons() {
  for (const button of document.querySelectorAll<HTMLButtonElement>('[data-add-inquiry]')) {
    button.hidden = false
  }
}

function offerCard(slug: string): HTMLElement | null {
  return document.querySelector<HTMLElement>(`article[data-offer="${CSS.escape(slug)}"]`)
}

function lineFromSlug(slug: string): InquiryLine | null {
  const card = offerCard(slug)
  if (!card) return null
  const add = card.querySelector<HTMLElement>('[data-add-inquiry]')
  if (!add) return null
  const name = add.dataset.comboName
  const offerType = add.dataset.offerType as OfferType | undefined
  const price = Number(add.dataset.comboPrice)
  const moq = add.dataset.moq
  const typeLabel = add.dataset.typeLabel
  const catalog = root()
  const pricePrefix = catalog?.dataset.pricePrefix
  const moqLabel = catalog?.dataset.moqLabel
  if (
    !name ||
    (offerType !== 'combo' && offerType !== 'product') ||
    !Number.isFinite(price) ||
    !moq ||
    !typeLabel ||
    !pricePrefix ||
    !moqLabel
  ) {
    return null
  }
  return {
    name,
    offerType,
    startingPrice: price,
    moq,
    typeLabel,
    pricePrefix,
    moqLabel,
  }
}

function updateInquiryBar(slugs: string[]) {
  const bar = document.getElementById('inquiry-bar')
  const countEl = document.querySelector<HTMLElement>('[data-inquiry-count]')
  const namesEl = document.querySelector<HTMLElement>('[data-inquiry-names]')
  const ask = document.querySelector<HTMLAnchorElement>('[data-inquiry-whatsapp]')
  const catalog = root()
  if (!bar || !countEl || !ask || !catalog) return

  // Prefer cards that are currently on this page; fall back to any stored slug
  // that still has a card in the DOM (including filter-hidden ones).
  const valid = slugs.filter((slug) => offerCard(slug))
  if (valid.length !== slugs.length && !isDetailPage()) {
    writeSlugs(valid)
  }

  const template = catalog.dataset.inquiryBarTemplate ?? '{count} in inquiry'
  countEl.textContent = template.replace('{count}', String(valid.length))

  if (valid.length === 0) {
    bar.hidden = true
    catalog.dataset.inquiryOpen = 'false'
    if (namesEl) {
      namesEl.textContent = ''
      namesEl.hidden = true
    }
    return
  }

  const lines = valid
    .map((slug) => lineFromSlug(slug))
    .filter((line): line is InquiryLine => line !== null)

  if (namesEl) {
    const names = lines.map((line) => line.name)
    namesEl.textContent = names.join(' · ')
    namesEl.hidden = names.length === 0
  }

  bar.hidden = false
  catalog.dataset.inquiryOpen = 'true'

  const number = catalog.dataset.whatsappNumber
  const intro = catalog.dataset.inquiryIntro
  const outro = catalog.dataset.inquiryOutro
  if (!number || !intro || !outro || lines.length === 0) return

  const text = composeInquiryListText(lines, intro, outro, readUtm())
  ask.href = buildWhatsAppUrl(number, text)
  ask.dataset.inquiryNames = lines.map((line) => line.name).join(', ')
  ask.dataset.inquiryValue = String(
    lines.reduce((sum, line) => sum + line.startingPrice, 0),
  )
  ask.dataset.inquiryCount = String(lines.length)
}

function trackLead(target: HTMLElement) {
  if (typeof window.fbq !== 'function') return
  const kind = target.dataset.leadKind

  if (kind === 'inquiry') {
    const names = target.dataset.inquiryNames ?? 'Inquiry list'
    const value = Number(target.dataset.inquiryValue ?? '0')
    const numItems = Number(target.dataset.inquiryCount ?? '0')
    window.fbq('track', 'Lead', {
      content_name: names.slice(0, 100),
      content_category: 'packaging-inquiry',
      currency: 'BDT',
      value,
      num_items: numItems,
    })
    return
  }

  const name = target.dataset.comboName
  const price = Number(target.dataset.comboPrice)
  const offerType = target.dataset.offerType
  if (!name || !Number.isFinite(price)) return
  window.fbq('track', 'Lead', {
    content_name: name,
    content_category:
      offerType === 'product' ? 'packaging-product' : 'packaging-combo',
    currency: 'BDT',
    value: price,
  })
}

function onAdd(button: HTMLButtonElement) {
  const slug = button.dataset.offer
  if (!slug) return
  const slugs = readSlugs()
  if (slugs.includes(slug) || slugs.length >= MAX_ITEMS) {
    updateInquiryBar(slugs)
    return
  }
  slugs.push(slug)
  writeSlugs(slugs)
  updateInquiryBar(slugs)

  const added = button.dataset.addedLabel
  const original = button.dataset.addLabel
  if (added && original) {
    button.textContent = added
    window.setTimeout(() => {
      button.textContent = original
    }, 2000)
  }
}

function init() {
  const utm = readUtm()
  applyHighlight()
  rewriteInquireLinks(utm)
  revealAddButtons()
  revealTypeFilter()

  let slugs = readSlugs()
  if (!isDetailPage()) {
    slugs = slugs.filter((slug) => offerCard(slug))
    writeSlugs(slugs)
  } else {
    // Keep full inquiry list in storage; Ask only uses offers present on this page.
    slugs = slugs.filter((slug) => offerCard(slug))
  }
  updateInquiryBar(slugs)
}

function onDocumentClick(event: Event) {
  const target = event.target
  if (!(target instanceof Element)) return

  const typeFilterBtn = target.closest<HTMLButtonElement>('[data-type-filter]')
  if (typeFilterBtn && typeFilterBtn.closest('#type-filter')) {
    onTypeFilterClick(typeFilterBtn)
    return
  }

  const add = target.closest<HTMLButtonElement>('[data-add-inquiry]')
  if (add) {
    onAdd(add)
    return
  }

  const clear = target.closest('[data-inquiry-clear]')
  if (clear) {
    writeSlugs([])
    updateInquiryBar([])
    return
  }

  const lead = target.closest<HTMLElement>('[data-lead]')
  if (lead) {
    trackLead(lead)
    if (lead.matches('[data-inquiry-whatsapp]')) {
      writeSlugs([])
    }
  }
}

let clickBound = false
function bindOnce() {
  if (clickBound) return
  clickBound = true
  document.addEventListener('click', onDocumentClick)
}

document.addEventListener('astro:page-load', () => {
  bindOnce()
  init()
})

// First paint without waiting for ClientRouter page-load (fallback).
bindOnce()
init()
