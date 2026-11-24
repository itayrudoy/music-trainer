import { BeatIndicator } from '../BeatIndicator/BeatIndicator'
import { MetronomeToggle } from '../MetronomeToggle/MetronomeToggle'
import { TempoControl } from '../TempoControl/TempoControl'
import styles from './MetronomePanel.module.css'

interface MetronomePanelProps {
  on: boolean
  onToggle: () => void
  beatsPerBar: number
  activeBeat: number | null
  tempo: number
  tempoRange: { min: number; max?: number; step: number }
  onTempoChange: (tempo: number) => void
}

/** Everything that belongs to the metronome, framed together under one on/off switch. */
export function MetronomePanel({
  on,
  onToggle,
  beatsPerBar,
  activeBeat,
  tempo,
  tempoRange,
  onTempoChange,
}: MetronomePanelProps) {
  return (
    <section className={styles.frame} aria-label="Metronome">
      <div className={styles.legend}>
        <span className={styles.label}>Metronome</span>
        <MetronomeToggle on={on} onToggle={onToggle} />
      </div>
      <BeatIndicator beatsPerBar={beatsPerBar} activeBeat={on ? activeBeat : null} />
      <TempoControl
        tempo={tempo}
        min={tempoRange.min}
        max={tempoRange.max}
        step={tempoRange.step}
        onChange={onTempoChange}
        dimmed={!on}
      />
    </section>
  )
}
