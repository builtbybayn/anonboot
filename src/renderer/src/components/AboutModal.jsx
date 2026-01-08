import { useEffect } from 'react'
import styles from './AboutModal.module.css'
import { XIcon } from './Icons'

const AboutModal = ({ isOpen, onClose }) => {
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
          <div className={styles.title}>About</div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <XIcon className={styles.closeIcon} />
          </button>
        </div>
        <div className={styles.body}>
          <div className={styles.contentPanel}>
            <p className={styles.paragraph}>
              This tool intends to improve opsec and anonymity on your machine. It&apos;s a
              centralized place to toggle all of the settings that put your privacy at risk.
            </p>
            <p className={styles.paragraph}>
              There&apos;s many sneaky ways which your data&apos;s collected on windows. Every way that I
              found it possible to leak any relevant data, I added a way to disable within this app.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutModal
