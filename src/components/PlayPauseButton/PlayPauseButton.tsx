import styles from './PlayPauseButton.module.css'

interface PlayPauseButtonProps {
  playing: boolean
  onToggle: () => void
}

export function PlayPauseButton({ playing, onToggle }: PlayPauseButtonProps) {
  return (
    <button className={styles.button} aria-label={playing ? 'Pause' : 'Play'} onClick={onToggle}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        {playing ? (
          <>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </>
        ) : (
          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
        )}
      </svg>
    </button>
  )
}
