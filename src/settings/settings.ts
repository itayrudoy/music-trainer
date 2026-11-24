import { TRAINER_CONFIG } from '../config'
import { ALL_KEYS } from '../music/keys'

export interface IntervalSec {
  min: number
  max: number
}

export interface Settings {
  enabledKeyIds: string[]
  intervalSec: IntervalSec
  voiceOn: boolean
  metronomeOn: boolean
  tempo: number
}

const STORAGE_KEY = 'key-change-trainer/settings'
const { tempo, keyChangeIntervalSec, minEnabledKeys } = TRAINER_CONFIG

export const DEFAULT_SETTINGS: Settings = {
  enabledKeyIds: ALL_KEYS.map((key) => key.id),
  intervalSec: { ...keyChangeIntervalSec.initial },
  voiceOn: true,
  metronomeOn: true,
  tempo: tempo.initial,
}

function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value)
}

/** Keeps every valid stored field and falls back to the default for anything else. */
function sanitize(raw: unknown): Settings {
  if (typeof raw !== 'object' || raw === null) return DEFAULT_SETTINGS
  const stored = raw as Partial<Record<keyof Settings, unknown>>
  const settings = { ...DEFAULT_SETTINGS }

  if (Array.isArray(stored.enabledKeyIds)) {
    const ids = ALL_KEYS.map((key) => key.id).filter((id) => (stored.enabledKeyIds as unknown[]).includes(id))
    if (ids.length >= minEnabledKeys) settings.enabledKeyIds = ids
  }

  const interval = stored.intervalSec as Partial<IntervalSec> | undefined
  if (
    isInteger(interval?.min) &&
    isInteger(interval?.max) &&
    interval.min >= keyChangeIntervalSec.minSec &&
    interval.min < interval.max
  ) {
    settings.intervalSec = { min: interval.min, max: interval.max }
  }

  if (typeof stored.voiceOn === 'boolean') settings.voiceOn = stored.voiceOn
  if (typeof stored.metronomeOn === 'boolean') settings.metronomeOn = stored.metronomeOn

  if (
    isInteger(stored.tempo) &&
    stored.tempo >= tempo.min &&
    stored.tempo % tempo.step === 0
  ) {
    settings.tempo = stored.tempo
  }

  return settings
}

// Storage can be missing or throw (private windows, blocked site data), so the app
// always works without it.
export function loadSettings(): Settings {
  try {
    const json = localStorage.getItem(STORAGE_KEY)
    return json ? sanitize(JSON.parse(json)) : DEFAULT_SETTINGS
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch {
    // Not saving is fine; the settings still apply for this visit.
  }
}
