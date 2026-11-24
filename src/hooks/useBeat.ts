import { useEffect, useEffectEvent, useRef, useState } from 'react'

interface UseBeatOptions {
  playing: boolean
  tempo: number
  beatsPerBar: number
  onBeat?: (beat: number) => void
}

/** Current beat in the bar (0-based) while playing, `null` while paused. */
export function useBeat({ playing, tempo, beatsPerBar, onBeat }: UseBeatOptions): number | null {
  const [beat, setBeat] = useState(0)
  const [wasPlaying, setWasPlaying] = useState(playing)
  const beatRef = useRef(0)
  const lastBeatAt = useRef(0)
  const emitBeat = useEffectEvent((b: number) => onBeat?.(b))

  // Every start begins on beat 1.
  if (playing !== wasPlaying) {
    setWasPlaying(playing)
    if (playing) setBeat(0)
  }

  useEffect(() => {
    if (!playing) return
    beatRef.current = 0
    lastBeatAt.current = performance.now()
    emitBeat(0)
  }, [playing])

  // On a tempo change, the next beat lands one new period after the last beat,
  // so the pulse keeps going instead of restarting.
  useEffect(() => {
    if (!playing) return
    const period = 60_000 / tempo
    let id: ReturnType<typeof setTimeout>

    const scheduleNext = (delay: number) => {
      id = setTimeout(() => {
        lastBeatAt.current = performance.now()
        beatRef.current = (beatRef.current + 1) % beatsPerBar
        setBeat(beatRef.current)
        emitBeat(beatRef.current)
        scheduleNext(period)
      }, delay)
    }

    const sinceLastBeat = performance.now() - lastBeatAt.current
    scheduleNext(Math.max(0, period - sinceLastBeat))
    return () => clearTimeout(id)
  }, [playing, tempo, beatsPerBar])

  return playing ? beat : null
}
