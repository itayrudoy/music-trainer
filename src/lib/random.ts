export function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

/** Picks a random item, never returning `exclude` (when there is another option). */
export function pickRandom<T>(items: readonly T[], exclude?: T): T {
  const options = items.filter((item) => item !== exclude)
  const pool = options.length > 0 ? options : items
  return pool[Math.floor(Math.random() * pool.length)]
}
