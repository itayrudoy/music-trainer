import { useEffect, useEffectEvent } from 'react'

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  )
}

/**
 * Calls `onPress` when the space bar is pressed anywhere on the page.
 * Space is also swallowed on focused buttons, so it never "clicks" them a second time.
 * While `enabled` is false, space keeps its normal behavior.
 */
export function useSpaceKey(onPress: () => void, enabled = true) {
  const press = useEffectEvent(onPress)

  useEffect(() => {
    if (!enabled) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code !== 'Space' || isTypingTarget(event.target)) return
      event.preventDefault()
      if (!event.repeat) press()
    }
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'Space' && !isTypingTarget(event.target)) event.preventDefault()
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [enabled])
}
