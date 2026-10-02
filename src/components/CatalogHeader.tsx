import type { Brand } from '../lib/types.ts'

type Props = {
  brand: Brand
}

export function CatalogHeader({ brand }: Props) {
  return (
    <header className="catalog-header">
      <h1 className="catalog-header__name">{brand.businessName}</h1>
      <p className="catalog-header__headline">{brand.headline}</p>
      <p className="catalog-header__subheadline">{brand.subheadline}</p>
    </header>
  )
}
