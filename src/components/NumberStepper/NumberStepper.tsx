import { RepeatButton } from '../RepeatButton/RepeatButton'
import styles from './NumberStepper.module.css'

interface NumberStepperProps {
  label: string
  value: number
  unit: string
  min: number
  max: number
  onChange: (value: number) => void
}

/** A labelled − value + row that moves in whole steps within [min, max]. */
export function NumberStepper({ label, value, unit, min, max, onChange }: NumberStepperProps) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>{label}</span>
      <div className={styles.stepper}>
        <RepeatButton
          className={styles.step}
          label={`${label}: less`}
          disabled={value <= min}
          onStep={() => onChange(Math.max(min, value - 1))}
        >
          −
        </RepeatButton>
        <div className={styles.value} aria-live="polite">
          {value} <span className={styles.unit}>{unit}</span>
        </div>
        <RepeatButton
          className={styles.step}
          label={`${label}: more`}
          disabled={value >= max}
          onStep={() => onChange(Math.min(max, value + 1))}
        >
          +
        </RepeatButton>
      </div>
    </div>
  )
}
