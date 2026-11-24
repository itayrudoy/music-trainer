import { useEffect, useRef, useState } from 'react'
import { TRAINER_CONFIG } from '../../config'
import type { MusicalKey } from '../../music/keys'
import type { IntervalSec } from '../../settings/settings'
import { IconButton } from '../IconButton/IconButton'
import { CloseIcon } from '../icons'
import { NumberStepper } from '../NumberStepper/NumberStepper'
import styles from './SettingsPanel.module.css'

const { minEnabledKeys, keyChangeIntervalSec } = TRAINER_CONFIG

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  keys: readonly MusicalKey[]
  enabledKeyIds: string[]
  onEnabledKeyIdsChange: (ids: string[]) => void
  intervalSec: IntervalSec
  onIntervalChange: (interval: IntervalSec) => void
}

/**
 * Side panel with the less-used settings. Built on a modal <dialog>, which gives
 * focus handling, Escape to close and an inert page behind it for free.
 */
export function SettingsPanel({
  open,
  onClose,
  keys,
  enabledKeyIds,
  onEnabledKeyIdsChange,
  intervalSec,
  onIntervalChange,
}: SettingsPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [tooFewKeys, setTooFewKeys] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const toggleKey = (id: string) => {
    const isOn = enabledKeyIds.includes(id)
    if (isOn && enabledKeyIds.length <= minEnabledKeys) {
      setTooFewKeys(true)
      return
    }
    setTooFewKeys(false)
    // Rebuild from `keys` so the stored order always follows the key list.
    onEnabledKeyIdsChange(
      keys.map((key) => key.id).filter((keyId) => (keyId === id ? !isOn : enabledKeyIds.includes(keyId))),
    )
  }

  const selectAll = () => {
    setTooFewKeys(false)
    onEnabledKeyIdsChange(keys.map((key) => key.id))
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="settings-title"
      onClose={onClose}
      // The panel fills the dialog, so a click on the dialog itself is a click on the backdrop.
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className={styles.content}>
        <header className={styles.header}>
          <h2 id="settings-title" className={styles.title}>
            Settings
          </h2>
          <IconButton label="Close settings" onClick={onClose} className={styles.close}>
            <CloseIcon />
          </IconButton>
        </header>

        <section className={styles.section} aria-labelledby="settings-keys">
          <div className={styles.sectionHeader}>
            <h3 id="settings-keys" className={styles.sectionTitle}>
              Keys
            </h3>
            <button className={styles.link} onClick={selectAll}>
              Select all
            </button>
          </div>
          <div className={styles.keys}>
            {keys.map((key) => {
              const isOn = enabledKeyIds.includes(key.id)
              return (
                <button
                  key={key.id}
                  className={isOn ? `${styles.key} ${styles.keyOn}` : styles.key}
                  aria-pressed={isOn}
                  onClick={() => toggleKey(key.id)}
                >
                  {key.label}
                </button>
              )
            })}
          </div>
          <p className={tooFewKeys ? `${styles.hint} ${styles.warning}` : styles.hint} role="status">
            Keep at least {minEnabledKeys} keys on.
          </p>
        </section>

        <section className={styles.section} aria-labelledby="settings-interval">
          <h3 id="settings-interval" className={styles.sectionTitle}>
            Time between changes
          </h3>
          <NumberStepper
            label="At least"
            value={intervalSec.min}
            unit="s"
            min={keyChangeIntervalSec.minSec}
            max={intervalSec.max - 1}
            onChange={(min) => onIntervalChange({ ...intervalSec, min })}
          />
          <NumberStepper
            label="At most"
            value={intervalSec.max}
            unit="s"
            min={intervalSec.min + 1}
            max={Infinity}
            onChange={(max) => onIntervalChange({ ...intervalSec, max })}
          />
        </section>
      </div>
    </dialog>
  )
}
