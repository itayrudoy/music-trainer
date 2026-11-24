import type { MusicalKey } from '../../music/keys'
import styles from './KeyDisplay.module.css'

interface KeyDisplayProps {
  musicalKey: MusicalKey
}

export function KeyDisplay({ musicalKey }: KeyDisplayProps) {
  return (
    <div className={styles.key} aria-live="polite">
      {musicalKey.label}
    </div>
  )
}
