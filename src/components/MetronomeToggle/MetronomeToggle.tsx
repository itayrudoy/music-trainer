import styles from './MetronomeToggle.module.css'

interface MetronomeToggleProps {
  on: boolean
  onToggle: () => void
}

/** Vertical switch: knob up = metronome on, knob down = off. */
export function MetronomeToggle({ on, onToggle }: MetronomeToggleProps) {
  return (
    <button
      className={on ? `${styles.track} ${styles.on}` : styles.track}
      role="switch"
      aria-checked={on}
      aria-label="Metronome"
      onClick={onToggle}
    >
      <span className={styles.knob} />
    </button>
  )
}
