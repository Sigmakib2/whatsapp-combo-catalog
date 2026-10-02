type Props = {
  note: string
}

export function CatalogFooter({ note }: Props) {
  return (
    <footer className="catalog-footer">
      <p>{note}</p>
    </footer>
  )
}
