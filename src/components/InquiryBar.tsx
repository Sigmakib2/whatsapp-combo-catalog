import type { Brand } from '../lib/types.ts'

type Props = {
  brand: Brand
  whatsappNumber: string
}

export function InquiryBar({ brand, whatsappNumber }: Props) {
  return (
    <div id="inquiry-bar" className="inquiry-bar" hidden>
      <div className="inquiry-bar__inner">
        <div className="inquiry-bar__copy">
          <p className="inquiry-bar__count" data-inquiry-count>
            {brand.inquiryBarTemplate.replace('{count}', '0')}
          </p>
          <p className="inquiry-bar__names" data-inquiry-names hidden></p>
        </div>
        <div className="inquiry-bar__actions">
          <a
            className="btn btn--primary inquiry-bar__ask"
            href={`https://wa.me/${whatsappNumber}`}
            data-inquiry-whatsapp
            data-lead
            data-lead-kind="inquiry"
          >
            {brand.inquiryAskLabel}
          </a>
          <button type="button" className="inquiry-bar__clear" data-inquiry-clear>
            {brand.inquiryClearLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
