import { defineArrayMember, defineField, defineType } from 'sanity'

export const offer = defineType({
  name: 'offer',
  title: 'Offer',
  type: 'document',
  fields: [
    defineField({
      name: 'offerType',
      title: 'Offer type',
      type: 'string',
      options: {
        list: [
          { title: 'Combo', value: 'combo' },
          { title: 'Product', value: 'product' },
        ],
        layout: 'radio',
      },
      initialValue: 'combo',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'startingPrice',
      title: 'Starting price (BDT)',
      type: 'number',
      validation: (rule) =>
        rule.required().integer().min(1).max(10_000_000),
    }),
    defineField({
      name: 'moq',
      title: 'MOQ',
      type: 'string',
      description: 'Example: 300 pcs',
      validation: (rule) => rule.required().max(40),
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'string',
      validation: (rule) => rule.max(140),
    }),
    defineField({
      name: 'items',
      title: 'Included items',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) =>
        rule.max(12).custom((items, context) => {
          const parent = context.parent as { offerType?: string } | undefined
          const list = Array.isArray(items) ? items : []
          if (parent?.offerType === 'combo' && list.length < 1) {
            return 'Combos need at least one included item'
          }
          if (list.some((item) => typeof item === 'string' && item.length > 80)) {
            return 'Each item must be 80 characters or fewer'
          }
          return true
        }),
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description:
        'First image is the cover on the menu. All images show on the offer page. Max 8.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              validation: (rule) => rule.required().max(140),
            }),
          ],
        }),
      ],
      validation: (rule) =>
        rule.max(8).custom((images, context) => {
          const parent = context.parent as { image?: { asset?: unknown } } | undefined
          const list = Array.isArray(images) ? images : []
          if (list.length >= 1) return true
          if (parent?.image?.asset) return true
          return 'Add at least one image'
        }),
    }),
    defineField({
      name: 'image',
      title: 'Cover image (legacy)',
      type: 'image',
      description:
        'Used only when Images is empty. Prefer the Images field above.',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (rule) => rule.max(140),
        }),
      ],
    }),
    defineField({
      name: 'whatsappText',
      title: 'WhatsApp message',
      type: 'text',
      rows: 4,
      initialValue:
        'Hi, I am interested in the *{name}*. Please share sizes, materials, and the final price for my quantity.',
      validation: (rule) => rule.required().max(500),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort order',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: 'hidden',
      title: 'Hidden',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: 'Sort order',
      name: 'sortOrderAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      price: 'startingPrice',
      moq: 'moq',
      offerType: 'offerType',
      media: 'images.0',
      legacyMedia: 'image',
    },
    prepare: ({ title, price, moq, offerType, media, legacyMedia }) => ({
      title: title || 'Untitled offer',
      subtitle: `${offerType === 'product' ? 'Product' : 'Combo'} · ৳${price ?? '—'} · MOQ ${moq ?? '—'}`,
      media: media || legacyMedia,
    }),
  },
})
