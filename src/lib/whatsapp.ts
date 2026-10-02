import type { InquiryLine, UtmParams } from './types.ts'

const WHATSAPP_RE = /^8801\d{9}$/

export function applyNameToken(whatsappText: string, name: string): string {
  return whatsappText.replaceAll('{name}', name)
}

function appendAdLine(message: string, utm: UtmParams): string {
  const parts = [utm.source, utm.campaign, utm.content]
    .map((part) => part?.trim())
    .filter((part): part is string => Boolean(part))

  if (parts.length === 0) {
    return message
  }

  return `${message}\n\nAd: ${parts.join(' / ')}`
}

export function composeInquiryText(
  whatsappText: string,
  name: string,
  utm: UtmParams,
): string {
  const message = applyNameToken(whatsappText, name).trim()
  return appendAdLine(message, utm)
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    amount,
  )
}

export function composeInquiryListText(
  lines: InquiryLine[],
  intro: string,
  outro: string,
  utm: UtmParams,
): string {
  if (lines.length === 0) {
    throw new Error('Inquiry list is empty')
  }

  const capped = lines.slice(0, 12)
  const body = capped
    .map((line, index) => {
      const price = formatPrice(line.startingPrice)
      return `${index + 1}. *${line.name}* (${line.typeLabel}) — ${line.pricePrefix} ৳${price} — ${line.moqLabel} ${line.moq}`
    })
    .join('\n')

  const message = `${intro.trim()}\n\n${body}\n\n${outro.trim()}`
  return appendAdLine(message, utm)
}

export function normalizeWhatsAppNumber(number: string): string {
  const digits = number.replace(/[\s+\-()]/g, '')
  if (!WHATSAPP_RE.test(digits)) {
    throw new Error('Invalid WhatsApp number')
  }
  return digits
}

export function buildWhatsAppUrl(number: string, text: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}
