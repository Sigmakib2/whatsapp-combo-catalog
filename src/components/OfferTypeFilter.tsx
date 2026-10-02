import type { Brand } from '../lib/types.ts'

type Props = {
  brand: Brand
  showCombo: boolean
  showProduct: boolean
}

export function OfferTypeFilter({ brand, showCombo, showProduct }: Props) {
  if (!showCombo || !showProduct) {
    return null
  }

  return (
    <div
      className="type-filter"
      id="type-filter"
      role="group"
      aria-label={brand.filterGroupLabel}
      hidden
    >
      <div className="type-filter__inner">
        <button
          type="button"
          className="type-filter__btn type-filter__btn--active"
          data-type-filter="all"
          aria-pressed="true"
        >
          {brand.filterAllLabel}
        </button>
        <button
          type="button"
          className="type-filter__btn"
          data-type-filter="combo"
          aria-pressed="false"
        >
          {brand.comboBadge}
        </button>
        <button
          type="button"
          className="type-filter__btn"
          data-type-filter="product"
          aria-pressed="false"
        >
          {brand.productBadge}
        </button>
      </div>
    </div>
  )
}
