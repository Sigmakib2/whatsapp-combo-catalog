import { defineField, defineType } from 'sanity'

const phoneRe = /^8801\d{9}$/
const pixelRe = /^\d{5,20}$/
const accentRe = /^#[0-9A-Fa-f]{6}$/

function stripPhone(value: string): string {
  return value.replace(/[\s+\-()]/g, '')
}

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'labels', title: 'Labels' },
  ],
  fields: [
    defineField({
      name: 'businessName',
      title: 'Business name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp number',
      type: 'string',
      group: 'identity',
      description:
        'Bangladesh mobile with country code, for example 8801712345678.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value || typeof value !== 'string') return 'Required'
          return phoneRe.test(stripPhone(value))
            ? true
            : 'Must be a Bangladesh mobile like 8801XXXXXXXXX'
        }),
    }),
    defineField({
      name: 'pixelId',
      title: 'Meta Pixel ID',
      type: 'string',
      group: 'identity',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          return pixelRe.test(value)
            ? true
            : 'Pixel ID must be 5–20 digits, or empty'
        }),
    }),
    defineField({
      name: 'headline',
      title: 'Headline',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
      group: 'identity',
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'accentColor',
      title: 'Accent color',
      type: 'string',
      group: 'identity',
      description: 'Optional. Example: #128c7e. Leave blank for the site default.',
      validation: (rule) =>
        rule.custom((value) => {
          if (!value) return true
          return accentRe.test(value)
            ? true
            : 'Use # followed by six hex digits, or leave blank'
        }),
    }),
    defineField({
      name: 'pageTitleSuffix',
      title: 'Page title suffix',
      type: 'string',
      group: 'labels',
      description:
        'Leave blank to use the site defaults. A developer can change the defaults in src/lib/brand.ts.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'pricePrefix',
      title: 'Price prefix',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'moqLabel',
      title: 'MOQ label',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'itemsLabel',
      title: 'Items label',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'comboBadge',
      title: 'Combo badge',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'productBadge',
      title: 'Product badge',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'inquireLabel',
      title: 'Inquire button label',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'addToInquiryLabel',
      title: 'Add to inquiry label',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'inquiryBarTemplate',
      title: 'Inquiry bar count template',
      type: 'string',
      group: 'labels',
      description: 'Use {count} where the number should appear.',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'inquiryAskLabel',
      title: 'Inquiry Ask button',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'inquiryClearLabel',
      title: 'Inquiry Clear label',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'inquiryAddedLabel',
      title: 'Added feedback label',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'inquiryIntro',
      title: 'Inquiry message intro',
      type: 'text',
      rows: 2,
      group: 'labels',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'inquiryOutro',
      title: 'Inquiry message outro',
      type: 'text',
      rows: 2,
      group: 'labels',
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: 'footerNote',
      title: 'Footer note',
      type: 'text',
      rows: 3,
      group: 'labels',
      validation: (rule) => rule.max(280),
    }),
    defineField({
      name: 'emptyMenuText',
      title: 'Empty menu text',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'backToMenuLabel',
      title: 'Back to menu label',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'filterAllLabel',
      title: 'Filter All label',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'filterGroupLabel',
      title: 'Filter group label (accessibility)',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(80),
    }),
    defineField({
      name: 'filterEmptyText',
      title: 'Filter empty text',
      type: 'string',
      group: 'labels',
      validation: (rule) => rule.max(120),
    }),
  ],
  preview: {
    select: { title: 'businessName' },
    prepare: ({ title }) => ({ title: title || 'Site settings' }),
  },
})
