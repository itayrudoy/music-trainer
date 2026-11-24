import { RepeatButton } from '../RepeatButton/RepeatButton'
import styles from './TempoControl.module.css'

interface TempoControlProps {
  tempo: number
  min: number
  /** Defaults to no upper limit. */
  max?: number
  step: number
  onChange: (tempo: number) => void
  /** Greys out the tempo value (e.g. while the metronome is off). */
  dimmed?: boolean
}

export function TempoControl({ tempo, min, max = Infinity, step, onChange, dimmed = false }: TempoControlProps) {
  return (
    <div className={styles.tempo}>
      <RepeatButton
        className={styles.step}
        label="Slower"
        disabled={tempo <= min}
        onStep={() => onChange(Math.max(min, tempo - step))}
      >
        −
      </RepeatButton>
      <div className={dimmed ? `${styles.value} ${styles.dimmed}` : styles.value}>
        {tempo} <span className={styles.unit}>bpm</span>
      </div>
      <RepeatButton
        className={styles.step}
        label="Faster"
        disabled={tempo >= max}
        onStep={() => onChange(Math.min(max, tempo + step))}
      >
        +
      </RepeatButton>
    </div>
  )
}
