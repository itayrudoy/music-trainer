import { useEffect, useMemo, useState } from 'react'
import { SoundEngine } from '../audio/SoundEngine'
import { ALL_KEYS } from '../music/keys'

/** The trainer's sounds: the metronome click and the recorded key names. */
export function useSounds() {
  const [engine] = useState(() => new SoundEngine(ALL_KEYS.map((key) => key.id)))

  useEffect(() => () => engine.dispose(), [engine])

  return useMemo(
    () => ({
      /** Call from the play button's click handler. */
      unlock: () => engine.unlock(),
      click: () => engine.click(),
      announce: (keyId: string) => engine.announce(keyId),
      silence: () => engine.silence(),
    }),
    [engine],
  )
}
