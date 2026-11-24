import { useMemo, useState } from 'react'
import { ChangeFlash } from './components/ChangeFlash/ChangeFlash'
import { IconButton } from './components/IconButton/IconButton'
import { GearIcon, SpeakerOffIcon, SpeakerOnIcon } from './components/icons'
import { KeyDisplay } from './components/KeyDisplay/KeyDisplay'
import { MetronomePanel } from './components/MetronomePanel/MetronomePanel'
import { PlayPauseButton } from './components/PlayPauseButton/PlayPauseButton'
import { SettingsPanel } from './components/SettingsPanel/SettingsPanel'
import { TRAINER_CONFIG } from './config'
import { useBeat } from './hooks/useBeat'
import { useRandomKey } from './hooks/useRandomKey'
import { useSettings } from './hooks/useSettings'
import { useSounds } from './hooks/useSounds'
import { useSpaceKey } from './hooks/useSpaceKey'
import { ALL_KEYS } from './music/keys'
import { BEATS_PER_BAR } from './music/meter'
import styles from './App.module.css'

function App() {
  const [settings, updateSettings] = useSettings()
  const [playing, setPlaying] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [changeCount, setChangeCount] = useState(0)
  const sounds = useSounds()

  const { enabledKeyIds, intervalSec, voiceOn, metronomeOn, tempo } = settings
  const enabledKeys = useMemo(() => ALL_KEYS.filter((key) => enabledKeyIds.includes(key.id)), [enabledKeyIds])
  const intervalMs = useMemo(
    () => ({ min: intervalSec.min * 1000, max: intervalSec.max * 1000 }),
    [intervalSec],
  )

  const musicalKey = useRandomKey({
    playing,
    keys: enabledKeys,
    intervalMs,
    onChange: (key) => {
      setChangeCount((n) => n + 1)
      if (voiceOn) sounds.announce(key.id)
    },
  })
  const beat = useBeat({
    playing,
    tempo,
    beatsPerBar: BEATS_PER_BAR,
    onBeat: metronomeOn ? sounds.click : undefined,
  })

  const togglePlaying = () => {
    if (playing) {
      sounds.silence()
    } else {
      sounds.unlock()
    }
    setPlaying(!playing)
  }
  useSpaceKey(togglePlaying, !settingsOpen)

  // Settings are changed while stopped, so opening them pauses everything.
  const openSettings = () => {
    if (playing) {
      sounds.silence()
      setPlaying(false)
    }
    setSettingsOpen(true)
  }

  const toggleVoice = () => {
    if (voiceOn) sounds.silence()
    updateSettings({ voiceOn: !voiceOn })
  }

  return (
    <main className={styles.app}>
      <ChangeFlash trigger={changeCount} />

      <IconButton label="Settings" className={styles.settingsButton} onClick={openSettings}>
        <GearIcon />
      </IconButton>

      <div className={styles.keyRow}>
        <KeyDisplay musicalKey={musicalKey} />
        <IconButton
          label="Voice"
          shape="round"
          aria-pressed={voiceOn}
          className={voiceOn ? styles.voiceOn : styles.voiceOff}
          onClick={toggleVoice}
        >
          {voiceOn ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
        </IconButton>
      </div>

      <MetronomePanel
        on={metronomeOn}
        onToggle={() => updateSettings({ metronomeOn: !metronomeOn })}
        beatsPerBar={BEATS_PER_BAR}
        activeBeat={beat}
        tempo={tempo}
        tempoRange={TRAINER_CONFIG.tempo}
        onTempoChange={(next) => updateSettings({ tempo: next })}
      />

      <PlayPauseButton playing={playing} onToggle={togglePlaying} />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        keys={ALL_KEYS}
        enabledKeyIds={enabledKeyIds}
        onEnabledKeyIdsChange={(ids) => updateSettings({ enabledKeyIds: ids })}
        intervalSec={intervalSec}
        onIntervalChange={(next) => updateSettings({ intervalSec: next })}
      />
    </main>
  )
}

export default App
