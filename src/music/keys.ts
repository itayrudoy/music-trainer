export interface MusicalKey {
  /** Also names the recorded clip: public/voice/<id>.mp3 */
  id: string
  label: string
}

/** All 12 keys, in circle-of-fifths order, spelled the common way. */
export const ALL_KEYS: readonly MusicalKey[] = [
  { id: 'C', label: 'C' },
  { id: 'G', label: 'G' },
  { id: 'D', label: 'D' },
  { id: 'A', label: 'A' },
  { id: 'E', label: 'E' },
  { id: 'B', label: 'B' },
  { id: 'Gb', label: 'G♭' },
  { id: 'Db', label: 'D♭' },
  { id: 'Ab', label: 'A♭' },
  { id: 'Eb', label: 'E♭' },
  { id: 'Bb', label: 'B♭' },
  { id: 'F', label: 'F' },
]
