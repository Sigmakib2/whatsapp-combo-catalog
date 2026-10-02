import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import { resolveBrand } from './brand.ts'
import { normalizeWhatsAppNumber } from './whatsapp.ts'
import type {
  CatalogContent,
  Offer,
  OfferType,
  SiteSettings,
} from './types.ts'
import fallback from '../data/fallback.json' with { type: 'json' }

const PIXEL_RE = /^\d{5,20}$/
const ACCENT_RE = /^#[0-9A-Fa-f]{6}$/

type SanityImage = {
  alt?: string
  hotspot?: unknown
  crop?: unknown
  asset?: { _ref?: string; _id?: string; url?: string }
}

type SanityOffer = {
  offerType?: string
  name?: string
  slug?: string
  startingPrice?: number
  moq?: string
  summary?: string
  items?: string[]
  whatsappText?: string
  image?: SanityImage
  images?: SanityImage[]
}

type SanityPayload = {
  settings: SiteSettings | null
  offers: SanityOffer[]
}

const CATALOG_QUERY = `{
  "settings": *[_id == "siteSettings"][0]{
    businessName,
    whatsappNumber,
    pixelId,
    headline,
    subheadline,
    accentColor,
    pageTitleSuffix,
    pricePrefix,
    moqLabel,
    itemsLabel,
    comboBadge,
    productBadge,
    inquireLabel,
    addToInquiryLabel,
    inquiryBarTemplate,
    inquiryAskLabel,
    inquiryClearLabel,
    inquiryAddedLabel,
    inquiryIntro,
    inquiryOutro,
    footerNote,
    emptyMenuText,
    backToMenuLabel,
    filterAllLabel,
    filterGroupLabel,
    filterEmptyText
  },
  "offers": *[_type == "offer" && hidden != true && (count(images[].asset) > 0 || defined(image.asset))] | order(sortOrder asc, name asc) {
    offerType,
    name,
    "slug": slug.current,
    startingPrice,
    moq,
    summary,
    items,
    whatsappText,
    image { alt, hotspot, crop, asset },
    images[] { alt, hotspot, crop, asset }
  }
}`

function env(name: string): string | undefined {
  const fromImport =
    typeof import.meta !== 'undefined'
      ? (import.meta.env as Record<string, string | undefined>)[name]
      : undefined
  return fromImport ?? process.env[name]
}

function isOfferType(value: string | undefined): value is OfferType {
  return value === 'combo' || value === 'product'
}

function cardImageUrl(
  builder: ReturnType<typeof createImageUrlBuilder>,
  image: SanityImage,
  width = 960,
): string {
  const height = Math.round((width * 3) / 4)
  return builder
    .image(image)
    .width(width)
    .height(height)
    .fit('crop')
    .format('webp')
    .quality(70)
    .url()
}

function cardSrcSet(
  builder: ReturnType<typeof createImageUrlBuilder>,
  image: SanityImage,
): string {
  return [480, 720, 960]
    .map((width) => `${cardImageUrl(builder, image, width)} ${width}w`)
    .join(', ')
}

function shareImageUrl(
  builder: ReturnType<typeof createImageUrlBuilder>,
  image: SanityImage,
): string {
  return builder
    .image(image)
    .width(1200)
    .height(630)
    .fit('crop')
    .format('jpg')
    .quality(80)
    .url()
}

function usableImages(raw: SanityOffer): SanityImage[] {
  const fromGallery = Array.isArray(raw.images) ? raw.images : []
  const gallery = fromGallery.filter(
    (image) => Boolean(image?.asset) && Boolean(image.alt?.trim()),
  )
  if (gallery.length > 0) return gallery
  if (raw.image?.asset && raw.image.alt?.trim()) return [raw.image]
  return []
}

function toCardImage(
  builder: ReturnType<typeof createImageUrlBuilder>,
  image: SanityImage,
): import('./types.ts').CardImage {
  return {
    src: cardImageUrl(builder, image, 960),
    srcSet: cardSrcSet(builder, image),
    sizes: '(max-width: 40rem) 100vw, 40rem',
    width: 960,
    height: 720,
    alt: image.alt!.trim(),
  }
}

function mapOffer(
  raw: SanityOffer,
  builder: ReturnType<typeof createImageUrlBuilder>,
): Offer | null {
  if (!raw.name || !raw.slug || !raw.moq || !raw.whatsappText?.trim()) {
    console.warn(`Skipping offer with incomplete fields: ${raw.name ?? '(unnamed)'}`)
    return null
  }
  if (!isOfferType(raw.offerType)) {
    console.warn(`Skipping offer with bad offerType: ${raw.name}`)
    return null
  }
  if (
    typeof raw.startingPrice !== 'number' ||
    !Number.isInteger(raw.startingPrice) ||
    raw.startingPrice < 1
  ) {
    console.warn(`Skipping offer with bad price: ${raw.name}`)
    return null
  }
  const items = Array.isArray(raw.items)
    ? raw.items.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : []
  if (raw.offerType === 'combo' && items.length === 0) {
    console.warn(`Skipping combo without items: ${raw.name}`)
    return null
  }
  const sourceImages = usableImages(raw)
  if (sourceImages.length === 0) {
    console.warn(`Skipping offer without images: ${raw.name}`)
    return null
  }

  const images = sourceImages.map((image) => toCardImage(builder, image))
  const cover = images[0]

  return {
    offerType: raw.offerType,
    name: raw.name,
    slug: raw.slug,
    startingPrice: raw.startingPrice,
    moq: raw.moq,
    summary: raw.summary?.trim() || undefined,
    items,
    whatsappText: raw.whatsappText,
    imageUrl: cover.src,
    imageSrcSet: cover.srcSet,
    imageSizes: cover.sizes,
    imageAlt: cover.alt,
    images,
  }
}

async function fetchFromSanity(
  projectId: string,
  dataset: string,
): Promise<CatalogContent> {
  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2026-10-01',
    useCdn: false,
    perspective: 'published',
  })

  const data = await client.fetch<SanityPayload>(CATALOG_QUERY)
  if (!data.settings) {
    throw new Error('Publish the Site settings document in Sanity.')
  }

  let whatsappNumber: string
  try {
    whatsappNumber = normalizeWhatsAppNumber(data.settings.whatsappNumber)
  } catch {
    throw new Error('Fix the WhatsApp number in Site settings.')
  }

  let pixelId = data.settings.pixelId?.trim() || undefined
  if (pixelId && !PIXEL_RE.test(pixelId)) {
    console.warn('Invalid Pixel ID in Site settings; omitting Pixel.')
    pixelId = undefined
  }

  let accentColor = data.settings.accentColor?.trim() || undefined
  if (accentColor && !ACCENT_RE.test(accentColor)) {
    console.warn('Invalid accentColor in Site settings; using default.')
    accentColor = undefined
  }

  const settings: SiteSettings = {
    ...data.settings,
    whatsappNumber,
    pixelId,
    accentColor,
  }

  const builder = createImageUrlBuilder({ projectId, dataset })
  const offers: Offer[] = []
  for (const raw of data.offers ?? []) {
    const mapped = mapOffer(raw, builder)
    if (mapped) {
      offers.push(mapped)
    }
  }

  const firstSource =
    data.offers
      ?.map((offer) => usableImages(offer)[0])
      .find((image): image is SanityImage => Boolean(image)) ?? undefined
  const share = firstSource ? shareImageUrl(builder, firstSource) : undefined

  return {
    settings,
    brand: resolveBrand(settings),
    offers,
    shareImageUrl: share,
  }
}

export async function getCatalog(): Promise<CatalogContent> {
  const projectId = env('SANITY_PROJECT_ID')?.trim()
  const dataset = env('SANITY_DATASET')?.trim()
  const onHosted =
    env('CF_PAGES') === '1' ||
    env('CF_WORKER') === '1' ||
    Boolean(env('CF_PAGES_URL')) ||
    env('VERCEL') === '1'
  const mustUseSanity = onHosted || import.meta.env.PROD

  if (projectId && dataset) {
    return fetchFromSanity(projectId, dataset)
  }

  if (mustUseSanity) {
    throw new Error(
      'Set SANITY_PROJECT_ID and SANITY_DATASET (required in production / on Vercel).',
    )
  }

  return fallback as CatalogContent
}
