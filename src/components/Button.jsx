export default function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const variantClass =
    variant === 'primary' ? 'btn--primary' :
    variant === 'ghost' ? 'btn--ghost' :
    variant === 'danger' ? 'btn--danger' :
    variant === 'linkedin' ? 'btn--linkedin' : 'btn--secondary'

  const sizeClass = size === 'sm' ? 'btn--sm' : size === 'lg' ? 'btn--lg' : ''

  const classes = ['btn', variantClass, sizeClass, className].filter(Boolean).join(' ')

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  )
}


