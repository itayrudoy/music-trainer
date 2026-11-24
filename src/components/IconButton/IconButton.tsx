import type { ButtonHTMLAttributes } from 'react'
import styles from './IconButton.module.css'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  shape?: 'round' | 'square'
}

/** Small grey icon-only button (voice, settings, close). */
export function IconButton({ label, shape = 'square', className, children, ...rest }: IconButtonProps) {
  const classes = [styles.button, shape === 'round' ? styles.round : styles.square, className]
  return (
    <button {...rest} aria-label={label} className={classes.filter(Boolean).join(' ')}>
      {children}
    </button>
  )
}
