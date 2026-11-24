import { useEffect, useEffectEvent, useState } from 'react'
import { pickRandom, randomBetween } from '../lib/random'
import type { MusicalKey } from '../music/keys'

interface UseRandomKeyOptions {
  playing: boolean
  keys: readonly MusicalKey[]
  intervalMs: { min: number; max: number }
  onChange?: (key: MusicalKey) => void
}

/**
 * Starts on a random key and, while playing, switches to a different random key
 * after a random delay. Pausing keeps the current key; resuming restarts the delay.
 */
export function useRandomKey({ playing, keys, intervalMs, onChange }: UseRandomKeyOptions): MusicalKey {
  const [key, setKey] = useState(() => pickRandom(keys))
  const { min, max } = intervalMs
  const emitChange = useEffectEvent((next: MusicalKey) => onChange?.(next))

  useEffect(() => {
    if (!playing) return
    const id = setTimeout(() => {
      const next = pickRandom(keys, key)
      setKey(next)
      emitChange(next)
    }, randomBetween(min, max))
    return () => clearTimeout(id)
  }, [playing, key, keys, min, max])

  return key
}
