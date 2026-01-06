import styles from './UpdateBanner.module.css'
import { XIcon } from './Icons'

const UpdateBanner = ({ onClose, onUpdate }) => {
  return (
    <div className={styles.banner}>
      {/* Text Layout */}
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <div className={styles.indicatorDot} />
          <div className={styles.header}>Update Available</div>
        </div>
        <div className={styles.bodyContainer}>
          <span>Install the latest app version to stay up to date.</span>
          <a
            className={styles.actionLink}
            onClick={(e) => {
              e.preventDefault()
              if (onUpdate) onUpdate()
            }}
            href="#"
          >
            Get latest version
          </a>
        </div>
      </div>

      {/* Close Button */}
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Dismiss update notification"
      >
        <XIcon className={styles.closeIcon} />
      </button>
    </div>
  )
}

export default UpdateBanner
