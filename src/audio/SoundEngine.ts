const CLICK_FREQUENCY_HZ = 1000
const CLICK_DURATION_S = 0.03
const CLICK_VOLUME = 0.6
const CLICK_DUCKED_VOLUME = 0.2
const DUCK_RAMP_S = 0.05

/**
 * All of the trainer's sound through one Web Audio context: the synthesized
 * metronome click and the recorded key names (public/voice/<keyId>.mp3).
 * While a key name plays, the click drops in volume so the name stands out.
 */
export class SoundEngine {
  private context: AudioContext | null = null
  private clickBus: GainNode | null = null
  private voices = new Map<string, AudioBuffer>()
  private currentVoice: AudioBufferSourceNode | null = null
  private readonly keyIds: readonly string[]

  constructor(keyIds: readonly string[]) {
    this.keyIds = keyIds
  }

  /** Must be called from a user gesture (e.g. the play button) so browsers allow audio. */
  unlock(): void {
    if (!this.context) {
      this.context = new AudioContext()
      this.clickBus = this.context.createGain()
      this.clickBus.gain.value = CLICK_VOLUME
      this.clickBus.connect(this.context.destination)
      void this.loadVoices(this.context)
    }
    if (this.context.state === 'suspended') void this.context.resume()
  }

  click(): void {
    if (!this.context || !this.clickBus) return
    const now = this.context.currentTime

    const oscillator = this.context.createOscillator()
    oscillator.frequency.value = CLICK_FREQUENCY_HZ

    const envelope = this.context.createGain()
    envelope.gain.setValueAtTime(1, now)
    envelope.gain.exponentialRampToValueAtTime(0.001, now + CLICK_DURATION_S)

    oscillator.connect(envelope).connect(this.clickBus)
    oscillator.start(now)
    oscillator.stop(now + CLICK_DURATION_S)
  }

  /** Plays the recorded name of `keyId`, cutting off any name still playing. */
  announce(keyId: string): void {
    const buffer = this.voices.get(keyId)
    if (!this.context || !buffer) return
    this.stopVoice()

    const source = this.context.createBufferSource()
    source.buffer = buffer
    source.connect(this.context.destination)
    source.onended = () => {
      if (this.currentVoice !== source) return
      this.currentVoice = null
      this.setClickDucked(false)
    }
    this.currentVoice = source
    this.setClickDucked(true)
    source.start()
  }

  silence(): void {
    this.stopVoice()
    this.setClickDucked(false)
  }

  dispose(): void {
    void this.context?.close()
    this.context = null
    this.clickBus = null
    this.currentVoice = null
    this.voices.clear()
  }

  private stopVoice(): void {
    const source = this.currentVoice
    this.currentVoice = null
    source?.stop()
  }

  private setClickDucked(ducked: boolean): void {
    if (!this.context || !this.clickBus) return
    const gain = this.clickBus.gain
    gain.cancelScheduledValues(this.context.currentTime)
    gain.setTargetAtTime(ducked ? CLICK_DUCKED_VOLUME : CLICK_VOLUME, this.context.currentTime, DUCK_RAMP_S)
  }

  private async loadVoices(context: AudioContext): Promise<void> {
    await Promise.all(
      this.keyIds.map(async (id) => {
        try {
          const response = await fetch(`${import.meta.env.BASE_URL}voice/${id}.mp3`)
          const buffer = await context.decodeAudioData(await response.arrayBuffer())
          if (this.context === context) this.voices.set(id, buffer)
        } catch {
          // A missing clip only silences that one key name.
        }
      }),
    )
  }
}
