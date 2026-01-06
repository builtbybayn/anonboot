import { useEffect } from 'react'
import styles from './LoadingModal.module.css'
import { XIcon, SpinnerIcon } from './Icons'

const LoadingModal = ({ isOpen, onClose, message = 'Initializing...' }) => {
  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Loading...</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <XIcon className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.spinnerContainer}>
          <SpinnerIcon className={styles.spinner} />
        </div>

        <div className={styles.statusSection}>
          <span className={styles.statusLabel}>Status:</span>
          <div className={styles.statusStrip}>
            <p className={styles.statusValue}>{message}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingModal
