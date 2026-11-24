import styles from './ChangeFlash.module.css'

interface ChangeFlashProps {
  /** Increment to play the flash again. 0 shows nothing. */
  trigger: number
}

/** Full-screen background flash behind the content, played on each key change. */
export function ChangeFlash({ trigger }: ChangeFlashProps) {
  if (trigger === 0) return null
  // A new `key` remounts the element, restarting the CSS animation.
  return <div key={trigger} className={styles.flash} aria-hidden="true" />
}
