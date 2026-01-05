import { useEffect, useRef } from 'react'
import styles from './AdminRequiredModal.module.css'

const AdminRequiredModal = () => {
  const buttonRef = useRef(null)

  // Focus trap
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus()
    }

    const handleKeyDown = (e) => {
      // Prevent Tab from leaving the modal (though there's only one focusable element)
      if (e.key === 'Tab') {
        e.preventDefault()
        if (buttonRef.current) buttonRef.current.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleExit = () => {
    window.close()
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Administrator Privileges Required</h2>
        </div>

        {/* Description Strip */}
        <div className={styles.descriptionStrip}>
          <p className={styles.bodyText}>
            anonBOOT needs Administrator access to modify system settings such as the registry,
            services, and firewall.
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.label}>To continue:</div>

          <div className={styles.stepsPanel}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <span>Close anonBOOT</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <span>Right-click the anonBOOT app icon</span>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <span>Select Run as administrator</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button ref={buttonRef} className={styles.exitButton} onClick={handleExit}>
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminRequiredModal
