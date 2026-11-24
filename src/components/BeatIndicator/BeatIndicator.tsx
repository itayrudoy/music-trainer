import styles from './BeatIndicator.module.css'

interface BeatIndicatorProps {
  beatsPerBar: number
  /** 0-based beat to highlight, or `null` for none. */
  activeBeat: number | null
}

export function BeatIndicator({ beatsPerBar, activeBeat }: BeatIndicatorProps) {
  return (
    <div className={styles.beats} aria-hidden="true">
      {Array.from({ length: beatsPerBar }, (_, i) => (
        <div key={i} className={i === activeBeat ? `${styles.beat} ${styles.active}` : styles.beat} />
      ))}
    </div>
  )
}
