export type OfferType = 'combo' | 'product'

export type UtmParams = {
  source?: string
  campaign?: string
  content?: string
}

export type InquiryLine = {
  name: string
  offerType: OfferType
  startingPrice: number
  moq: string
  typeLabel: string
  pricePrefix: string
  moqLabel: string
}

export type CardImage = {
  src: string
  srcSet?: string
  sizes?: string
  width: number
  height: number
  alt: string
}

export type Offer = {
  offerType: OfferType
  name: string
  slug: string
  startingPrice: number
  moq: string
  summary?: string
  items: string[]
  whatsappText: string
  /** Cover (first gallery image). */
  imageUrl: string
  imageSrcSet?: string
  imageSizes?: string
  imageAlt: string
  /** All gallery images; at least one. */
  images: CardImage[]
}

export type SiteSettings = {
  businessName: string
  whatsappNumber: string
  pixelId?: string
  headline: string
  subheadline: string
  accentColor?: string
  pageTitleSuffix?: string
  pricePrefix?: string
  moqLabel?: string
  itemsLabel?: string
  comboBadge?: string
  productBadge?: string
  inquireLabel?: string
  addToInquiryLabel?: string
  inquiryBarTemplate?: string
  inquiryAskLabel?: string
  inquiryClearLabel?: string
  inquiryAddedLabel?: string
  inquiryIntro?: string
  inquiryOutro?: string
  footerNote?: string
  emptyMenuText?: string
  backToMenuLabel?: string
  filterAllLabel?: string
  filterGroupLabel?: string
  filterEmptyText?: string
}

export type Brand = {
  businessName: string
  headline: string
  subheadline: string
  accentColor: string
  pageTitleSuffix: string
  pricePrefix: string
  moqLabel: string
  itemsLabel: string
  comboBadge: string
  productBadge: string
  inquireLabel: string
  addToInquiryLabel: string
  inquiryBarTemplate: string
  inquiryAskLabel: string
  inquiryClearLabel: string
  inquiryAddedLabel: string
  inquiryIntro: string
  inquiryOutro: string
  footerNote: string
  emptyMenuText: string
  backToMenuLabel: string
  filterAllLabel: string
  filterGroupLabel: string
  filterEmptyText: string
}

export type CatalogContent = {
  settings: SiteSettings
  brand: Brand
  offers: Offer[]
  shareImageUrl?: string
}
