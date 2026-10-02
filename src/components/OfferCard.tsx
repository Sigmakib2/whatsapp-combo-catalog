import {
  applyNameToken,
  buildWhatsAppUrl,
  composeInquiryText,
} from '../lib/whatsapp.ts'
import type { Brand, CardImage, Offer } from '../lib/types.ts'

type Props = {
  offer: Offer
  images: CardImage[]
  brand: Brand
  whatsappNumber: string
  isFirst: boolean
  variant?: 'list' | 'detail'
  detailHref?: string
  backHref?: string
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(
    amount,
  )
}

function OfferImage({
  image,
  eager,
}: {
  image: CardImage
  eager: boolean
}) {
  return (
    <img
      src={image.src}
      {...(image.srcSet ? { srcSet: image.srcSet } : {})}
      {...(image.sizes ? { sizes: image.sizes } : {})}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading={eager ? 'eager' : 'lazy'}
      {...(eager ? { fetchPriority: 'high' as const } : {})}
    />
  )
}

export function OfferCard({
  offer,
  images,
  brand,
  whatsappNumber,
  isFirst,
  variant = 'list',
  detailHref,
  backHref,
}: Props) {
  const typeLabel =
    offer.offerType === 'product' ? brand.productBadge : brand.comboBadge
  const message = applyNameToken(offer.whatsappText, offer.name)
  const href = buildWhatsAppUrl(
    whatsappNumber,
    composeInquiryText(offer.whatsappText, offer.name, {}),
  )
  const priceText = `${brand.pricePrefix} ৳${formatPrice(offer.startingPrice)}`
  const isDetail = variant === 'detail'
  const openDetail = !isDetail && detailHref
  const gallery = images.length > 0 ? images : []
  const cover = gallery[0]
  if (!cover) return null

  const name = <h2 className="offer-card__name">{offer.name}</h2>

  return (
    <article
      className={isDetail ? 'offer-card offer-card--detail' : 'offer-card'}
      id={`offer-${offer.slug}`}
      data-offer={offer.slug}
      data-offer-type={offer.offerType}
    >
      {isDetail && backHref ? (
        <p className="offer-card__back">
          <a href={backHref}>{brand.backToMenuLabel}</a>
        </p>
      ) : null}

      {isDetail && gallery.length > 1 ? (
        <div className="offer-gallery" aria-label={`${offer.name} photos`}>
          <div className="offer-gallery__track">
            {gallery.map((image, index) => (
              <div className="offer-gallery__slide" key={`${image.src}-${index}`}>
                <OfferImage image={image} eager={index === 0} />
              </div>
            ))}
          </div>
          <p className="offer-gallery__hint">Swipe for more photos</p>
        </div>
      ) : (
        <div className="offer-card__media">
          {openDetail ? (
            <a className="offer-card__media-link" href={detailHref}>
              <OfferImage image={cover} eager={isFirst} />
            </a>
          ) : (
            <OfferImage image={cover} eager={isFirst || isDetail} />
          )}
        </div>
      )}

      <div className="offer-card__body">
        <span className="offer-card__badge">{typeLabel}</span>
        {openDetail ? (
          <a className="offer-card__name-link" href={detailHref}>
            {name}
          </a>
        ) : (
          name
        )}
        <p className="offer-card__price">{priceText}</p>
        <p className="offer-card__moq">
          {brand.moqLabel} {offer.moq}
        </p>
        {offer.summary ? (
          <p className="offer-card__summary">{offer.summary}</p>
        ) : null}
        {offer.items.length > 0 ? (
          <div>
            <p className="offer-card__items-label">{brand.itemsLabel}</p>
            <ul className="offer-card__items">
              {offer.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="offer-card__actions">
          <a
            className="btn btn--primary"
            href={href}
            data-whatsapp
            data-lead
            data-lead-kind="single"
            data-combo-name={offer.name}
            data-combo-price={String(offer.startingPrice)}
            data-offer-type={offer.offerType}
            data-whatsapp-number={whatsappNumber}
            data-whatsapp-text={message}
          >
            {brand.inquireLabel}
          </a>
          <button
            type="button"
            className="btn btn--secondary"
            hidden
            data-add-inquiry
            data-offer={offer.slug}
            data-combo-name={offer.name}
            data-combo-price={String(offer.startingPrice)}
            data-offer-type={offer.offerType}
            data-moq={offer.moq}
            data-type-label={typeLabel}
            data-add-label={brand.addToInquiryLabel}
            data-added-label={brand.inquiryAddedLabel}
          >
            {brand.addToInquiryLabel}
          </button>
        </div>
      </div>
    </article>
  )
}
