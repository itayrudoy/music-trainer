import { useEffect, useRef, type ReactNode } from 'react'
import styles from './RepeatButton.module.css'

const HOLD_DELAY_MS = 400
const REPEAT_EVERY_MS = 80

interface RepeatButtonProps {
  label: string
  onStep: () => void
  disabled?: boolean
  className?: string
  children: ReactNode
}

/**
 * A button that steps once on press and keeps stepping while held (mouse or touch).
 * Keyboard activation (Enter / Space on focus) steps once per press.
 */
export function RepeatButton({ label, onStep, disabled = false, className, children }: RepeatButtonProps) {
  const latestOnStep = useRef(onStep)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Repeats run from timers, so they must always call the newest handler (with the newest value).
  useEffect(() => {
    latestOnStep.current = onStep
  })

  const stop = () => clearTimeout(timer.current)

  // Hitting a limit disables the button, and disabled buttons fire no pointerup.
  useEffect(() => {
    if (disabled) stop()
  }, [disabled])

  useEffect(() => stop, [])

  const repeat = () => {
    latestOnStep.current()
    timer.current = setTimeout(repeat, REPEAT_EVERY_MS)
  }

  return (
    <button
      className={className ? `${styles.button} ${className}` : styles.button}
      aria-label={label}
      disabled={disabled}
      onPointerDown={(event) => {
        if (event.button !== 0) return
        onStep()
        timer.current = setTimeout(repeat, HOLD_DELAY_MS)
      }}
      onPointerUp={stop}
      onPointerLeave={stop}
      onPointerCancel={stop}
      // Pointer presses already stepped; only keyboard clicks (detail 0) step here.
      onClick={(event) => event.detail === 0 && onStep()}
      onContextMenu={(event) => event.preventDefault()}
    >
      {children}
    </button>
  )
}
