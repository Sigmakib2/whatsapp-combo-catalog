/**
 * Seed demo Site settings + offers into Sanity.
 *
 * From studio/:
 *   npx sanity login
 *   npm run seed
 *
 * Or set SANITY_AUTH_TOKEN to an Editor/write token from
 * https://www.sanity.io/manage → API → Tokens
 */
import { createClient } from '@sanity/client'
import { createReadStream, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset =
  process.env.SANITY_STUDIO_DATASET ||
  process.env.SANITY_DATASET ||
  'production'

function resolveToken() {
  if (process.env.SANITY_AUTH_TOKEN) {
    return process.env.SANITY_AUTH_TOKEN
  }
  const result = spawnSync('npx', ['sanity', 'debug', '--secrets'], {
    cwd: __dirname,
    encoding: 'utf8',
    shell: true,
  })
  const match = result.stdout?.match(/Auth token:\s+'([^']+)'/)
  return match?.[1]
}

async function uploadImage(client, relativePath, filename) {
  const absolute = resolve(__dirname, '..', relativePath)
  if (!existsSync(absolute)) {
    throw new Error(`Missing image file: ${absolute}`)
  }
  return client.assets.upload('image', createReadStream(absolute), {
    filename,
    contentType: 'image/svg+xml',
  })
}

async function main() {
  if (!projectId) {
    throw new Error('Set SANITY_STUDIO_PROJECT_ID in studio/.env')
  }

  const token = resolveToken()
  if (!token) {
    throw new Error(
      'No auth token. In studio/ run: npx sanity login\nThen: npm run seed',
    )
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2026-10-01',
    token,
    useCdn: false,
  })

  console.log(`Seeding ${projectId}/${dataset}…`)

  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    businessName: 'Northline Packaging',
    whatsappNumber: '8801712345678',
    headline: 'Packaging for your shop',
    subheadline:
      'Browse combo packs and single products, then message us on WhatsApp. We will confirm size, print, and the final price.',
  })
  console.log('✓ Site settings')

  const starterAsset = await uploadImage(
    client,
    'public/samples/starter-shop-pack.svg',
    'starter-shop-pack.svg',
  )
  const brandAsset = await uploadImage(
    client,
    'public/samples/brand-mailer-pack.svg',
    'brand-mailer-pack.svg',
  )
  const mailersAsset = await uploadImage(
    client,
    'public/samples/poly-mailers.svg',
    'poly-mailers.svg',
  )

  const offers = [
    {
      _id: 'offer-starter-shop-pack',
      _type: 'offer',
      offerType: 'combo',
      name: 'Starter Shop Pack',
      slug: { _type: 'slug', current: 'starter-shop-pack' },
      startingPrice: 2500,
      moq: '300 pcs',
      summary: 'For a first order',
      items: ['Poly mailers', 'Thank-you cards', 'Round stickers'],
      whatsappText:
        'Hi, I am interested in the *Starter Shop Pack*. Please share sizes, materials, and the final price for my quantity.',
      sortOrder: 1,
      hidden: false,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: starterAsset._id },
        alt: 'Starter Shop Pack sample image',
      },
    },
    {
      _id: 'offer-brand-mailer-pack',
      _type: 'offer',
      offerType: 'combo',
      name: 'Brand Mailer Pack',
      slug: { _type: 'slug', current: 'brand-mailer-pack' },
      startingPrice: 6500,
      moq: '500 pcs',
      summary: 'For shops that print their logo',
      items: [
        'Printed mailers',
        'Tissue paper',
        'Logo stickers',
        'Thank-you cards',
      ],
      whatsappText:
        'Hi, I am interested in the *Brand Mailer Pack*. Please share sizes, materials, and the final price for my quantity.',
      sortOrder: 2,
      hidden: false,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: brandAsset._id },
        alt: 'Brand Mailer Pack sample image',
      },
    },
    {
      _id: 'offer-poly-mailers',
      _type: 'offer',
      offerType: 'product',
      name: 'Poly Mailers',
      slug: { _type: 'slug', current: 'poly-mailers' },
      startingPrice: 1200,
      moq: '500 pcs',
      summary: 'Plain mailers, no print',
      items: [],
      whatsappText:
        'Hi, I am interested in the *Poly Mailers*. Please share sizes, materials, and the final price for my quantity.',
      sortOrder: 3,
      hidden: false,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: mailersAsset._id },
        alt: 'Poly Mailers sample image',
      },
    },
  ]

  for (const offer of offers) {
    await client.createOrReplace(offer)
    console.log(`✓ Offer: ${offer.name}`)
  }

  const check = await client.fetch(`{
    "settings": *[_id == "siteSettings"][0]{businessName, whatsappNumber},
    "offers": *[_type == "offer"]|order(sortOrder asc){name, offerType, startingPrice, "slug": slug.current}
  }`)
  console.log('Verify:', JSON.stringify(check, null, 2))
  console.log('Done. Refresh Studio to see Site settings + 3 offers.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
