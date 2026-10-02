type Props = {
  text: string
}

export function EmptyMenu({ text }: Props) {
  return (
    <div className="empty-menu">
      <p>{text}</p>
    </div>
  )
}
