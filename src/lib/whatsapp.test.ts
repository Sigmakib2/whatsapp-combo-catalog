import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  applyNameToken,
  buildWhatsAppUrl,
  composeInquiryListText,
  composeInquiryText,
  normalizeWhatsAppNumber,
} from './whatsapp.ts'
import type { InquiryLine } from './types.ts'

describe('applyNameToken', () => {
  it('replaces every {name}', () => {
    assert.equal(
      applyNameToken('Hi *{name}* about {name}', 'Starter Pack'),
      'Hi *Starter Pack* about Starter Pack',
    )
  })

  it('leaves text without a token unchanged', () => {
    assert.equal(
      applyNameToken('Custom sentence only', 'Starter Pack'),
      'Custom sentence only',
    )
  })
})

describe('composeInquiryText', () => {
  it('omits the Ad line when UTM is empty', () => {
    assert.equal(
      composeInquiryText('Hi *{name}*', 'Mailers', {}),
      'Hi *Mailers*',
    )
  })

  it('builds a single UTM Ad line', () => {
    assert.equal(
      composeInquiryText('Hi *{name}*', 'Mailers', { source: 'facebook' }),
      'Hi *Mailers*\n\nAd: facebook',
    )
  })

  it('skips a gap in the middle of UTM parts', () => {
    assert.equal(
      composeInquiryText('Hi *{name}*', 'Mailers', {
        source: 'facebook',
        content: 'carousel-starter',
      }),
      'Hi *Mailers*\n\nAd: facebook / carousel-starter',
    )
  })
})

describe('composeInquiryListText', () => {
  const lines: InquiryLine[] = [
    {
      name: 'Starter Shop Pack',
      offerType: 'combo',
      startingPrice: 2500,
      moq: '300 pcs',
      typeLabel: 'Combo',
      pricePrefix: 'Starting at',
      moqLabel: 'MOQ',
    },
    {
      name: 'Poly Mailers',
      offerType: 'product',
      startingPrice: 1200,
      moq: '500 pcs',
      typeLabel: 'Product',
      pricePrefix: 'Starting at',
      moqLabel: 'MOQ',
    },
  ]

  it('builds intro, numbered lines, outro, and optional Ad line', () => {
    const text = composeInquiryListText(
      lines,
      'Hi, I am interested in these offers:',
      'Please share sizes, materials, and the final price for my quantity.',
      { source: 'facebook', campaign: 'mailers', content: 'carousel-starter' },
    )

    assert.match(text, /^Hi, I am interested in these offers:/)
    assert.match(
      text,
      /1\. \*Starter Shop Pack\* \(Combo\) — Starting at ৳2,500 — MOQ 300 pcs/,
    )
    assert.match(
      text,
      /2\. \*Poly Mailers\* \(Product\) — Starting at ৳1,200 — MOQ 500 pcs/,
    )
    assert.match(
      text,
      /Please share sizes, materials, and the final price for my quantity\./,
    )
    assert.match(text, /Ad: facebook \/ mailers \/ carousel-starter$/)
  })

  it('throws on an empty list', () => {
    assert.throws(() =>
      composeInquiryListText([], 'intro', 'outro', {}),
    )
  })
})

describe('normalizeWhatsAppNumber', () => {
  it('normalizes spaced and dashed numbers', () => {
    assert.equal(normalizeWhatsAppNumber('+880 1712-345678'), '8801712345678')
    assert.equal(normalizeWhatsAppNumber('(880) 1712 345678'), '8801712345678')
  })

  it('rejects invalid Bangladesh mobiles', () => {
    assert.throws(() => normalizeWhatsAppNumber('01712345678'))
    assert.throws(() => normalizeWhatsAppNumber('880171234567'))
    assert.throws(() => normalizeWhatsAppNumber('8802123456789'))
  })
})

describe('buildWhatsAppUrl', () => {
  it('encodes spaces as %20 and round-trips the text', () => {
    const url = buildWhatsAppUrl('8801712345678', 'Hello world')
    const parsed = new URL(url)
    assert.equal(parsed.host, 'wa.me')
    assert.equal(parsed.pathname, '/8801712345678')
    assert.equal(decodeURIComponent(parsed.searchParams.get('text') ?? ''), 'Hello world')
    assert.match(url, /text=Hello%20world/)
    assert.doesNotMatch(url, /text=Hello\+world/)
  })

  it('round-trips Bangla and emoji', () => {
    const message = 'হ্যালো 📦'
    const url = buildWhatsAppUrl('8801712345678', message)
    const parsed = new URL(url)
    assert.equal(
      decodeURIComponent(parsed.searchParams.get('text') ?? ''),
      message,
    )
  })
})
