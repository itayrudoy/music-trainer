export const TRAINER_CONFIG = {
  // Only lower bounds: everything must stay above zero, the rest is up to the player.
  tempo: { initial: 80, min: 5, step: 5 },
  keyChangeIntervalSec: {
    initial: { min: 3, max: 6 },
    minSec: 1,
  },
  /** Fewer than two keys leaves nothing to change to. */
  minEnabledKeys: 2,
} as const
