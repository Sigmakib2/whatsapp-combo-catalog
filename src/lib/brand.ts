import type { Brand, SiteSettings } from './types.ts'

export const brandDefaults = {
  pageTitleSuffix: 'Packaging catalog',
  pricePrefix: 'Starting at',
  moqLabel: 'MOQ',
  itemsLabel: 'Included',
  comboBadge: 'Combo',
  productBadge: 'Product',
  inquireLabel: 'Inquire on WhatsApp',
  addToInquiryLabel: 'Add to inquiry',
  inquiryBarTemplate: '{count} in inquiry',
  inquiryAskLabel: 'Ask on WhatsApp',
  inquiryClearLabel: 'Clear',
  inquiryAddedLabel: 'Added',
  inquiryIntro: 'Hi, I am interested in these offers:',
  inquiryOutro:
    'Please share sizes, materials, and the final price for my quantity.',
  footerNote:
    'Starting prices depend on size, material, print, and quantity. The final price is confirmed on WhatsApp.',
  emptyMenuText: 'Offers will appear here after they are published.',
  backToMenuLabel: 'Back to menu',
  filterAllLabel: 'All',
  filterGroupLabel: 'Show offers',
  filterEmptyText: 'No offers in this filter.',
  accentColor: '#128c7e',
} as const

const ACCENT_RE = /^#[0-9A-Fa-f]{6}$/

export function isAccentColor(value: string): boolean {
  return ACCENT_RE.test(value)
}

function pickLabel(
  value: string | undefined,
  fallback: string,
): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

export function resolveBrand(settings: SiteSettings): Brand {
  const accent = settings.accentColor?.trim()
  return {
    businessName: settings.businessName,
    headline: settings.headline,
    subheadline: settings.subheadline,
    accentColor:
      accent && isAccentColor(accent) ? accent : brandDefaults.accentColor,
    pageTitleSuffix: pickLabel(
      settings.pageTitleSuffix,
      brandDefaults.pageTitleSuffix,
    ),
    pricePrefix: pickLabel(settings.pricePrefix, brandDefaults.pricePrefix),
    moqLabel: pickLabel(settings.moqLabel, brandDefaults.moqLabel),
    itemsLabel: pickLabel(settings.itemsLabel, brandDefaults.itemsLabel),
    comboBadge: pickLabel(settings.comboBadge, brandDefaults.comboBadge),
    productBadge: pickLabel(settings.productBadge, brandDefaults.productBadge),
    inquireLabel: pickLabel(settings.inquireLabel, brandDefaults.inquireLabel),
    addToInquiryLabel: pickLabel(
      settings.addToInquiryLabel,
      brandDefaults.addToInquiryLabel,
    ),
    inquiryBarTemplate: pickLabel(
      settings.inquiryBarTemplate,
      brandDefaults.inquiryBarTemplate,
    ),
    inquiryAskLabel: pickLabel(
      settings.inquiryAskLabel,
      brandDefaults.inquiryAskLabel,
    ),
    inquiryClearLabel: pickLabel(
      settings.inquiryClearLabel,
      brandDefaults.inquiryClearLabel,
    ),
    inquiryAddedLabel: pickLabel(
      settings.inquiryAddedLabel,
      brandDefaults.inquiryAddedLabel,
    ),
    inquiryIntro: pickLabel(settings.inquiryIntro, brandDefaults.inquiryIntro),
    inquiryOutro: pickLabel(settings.inquiryOutro, brandDefaults.inquiryOutro),
    footerNote: pickLabel(settings.footerNote, brandDefaults.footerNote),
    emptyMenuText: pickLabel(
      settings.emptyMenuText,
      brandDefaults.emptyMenuText,
    ),
    backToMenuLabel: pickLabel(
      settings.backToMenuLabel,
      brandDefaults.backToMenuLabel,
    ),
    filterAllLabel: pickLabel(
      settings.filterAllLabel,
      brandDefaults.filterAllLabel,
    ),
    filterGroupLabel: pickLabel(
      settings.filterGroupLabel,
      brandDefaults.filterGroupLabel,
    ),
    filterEmptyText: pickLabel(
      settings.filterEmptyText,
      brandDefaults.filterEmptyText,
    ),
  }
}
