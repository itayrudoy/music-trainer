import { useCallback, useEffect, useState } from 'react'
import { loadSettings, saveSettings, type Settings } from '../settings/settings'

/** The user's settings, loaded from and saved to this browser. */
export function useSettings(): [Settings, (changes: Partial<Settings>) => void] {
  const [settings, setSettings] = useState(loadSettings)

  useEffect(() => saveSettings(settings), [settings])

  const update = useCallback(
    (changes: Partial<Settings>) => setSettings((current) => ({ ...current, ...changes })),
    [],
  )

  return [settings, update]
}
