import { useState, useEffect } from 'react'
import styles from './SupportModal.module.css'
import { XIcon, ChevronIcon, UsdcIcon, BtcIcon, EthIcon } from './Icons'

const ICON_MAP = {
  usdc: UsdcIcon,
  btc: BtcIcon,
  eth: EthIcon
}

const SupportModal = ({ isOpen, onClose, onOpenPayment, isCovered }) => {
  const [isTraditionalExpanded, setIsTraditionalExpanded] = useState(false)
  const [isCryptoExpanded, setIsCryptoExpanded] = useState(true)
  const [supportData, setSupportData] = useState(null)

  // Load Data
  useEffect(() => {
    const load = async () => {
      try {
        const data = await window.api.getSupportData()
        if (data && data.crypto) {
          setSupportData(data)
        }
        // Attempt background refresh (throttled by main process)
        // Only update local state if updated: true
        window.api.refreshSupportData().then((res) => {
          if (res && res.updated && res.data) {
            setSupportData(res.data)
          }
        })
      } catch (err) {
        console.error('Failed to load support data:', err)
      }
    }
    load()
  }, [])

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen && !isCovered) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose, isCovered])

  if (!isOpen) return null

  const handleCryptoClick = (item) => {
    // If it has networks (like USDC), use the first network for now
    if (item.networks && item.networks.length > 0) {
      const net = item.networks[0]
      onOpenPayment({
        assetId: item.assetId,
        networkId: net.networkId,
        title: net.label,
        address: net.address
      })
    } else {
      // Direct address (BTC, ETH)
      onOpenPayment({
        assetId: item.assetId,
        title: item.label,
        address: item.address
      })
    }
  }

  const renderCryptoList = () => {
    if (!supportData || !supportData.crypto) {
      return (
        <div className={styles.childRow} style={{ cursor: 'default' }}>
          <span className={styles.childLabel}>Loading...</span>
        </div>
      )
    }

    return supportData.crypto.map((item) => {
      const IconComponent = ICON_MAP[item.assetId]
      return (
        <div
          key={item.assetId}
          className={styles.childRow}
          onClick={() => handleCryptoClick(item)}
        >
          <span className={styles.childLabel}>{item.label}</span>
          {IconComponent && <IconComponent className={styles.childIcon} />}
        </div>
      )
    })
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>Support</div>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close">
            <XIcon className={styles.closeIcon} />
          </button>
        </div>

        {/* Description Strip */}
        <div className={styles.descriptionStrip}>
          <p className={styles.description}>
            Support the creation of more opsec & privacy oriented tools and apps.
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <div className={styles.label}>Pay with:</div>

          <div className={styles.sections}>
            {/* Traditional Section */}
            <div>
              <div
                className={`${styles.sectionHeader} ${isTraditionalExpanded ? styles.expanded : ''}`}
                onClick={() => setIsTraditionalExpanded(!isTraditionalExpanded)}
              >
                <span className={styles.sectionLabel}>Traditional</span>
                <ChevronIcon className={styles.chevronIcon} />
              </div>
              <div className={`${styles.childrenList} ${isTraditionalExpanded ? styles.open : ''}`}>
                <div className={styles.childrenInner}>
                  {/* Placeholder for Traditional Items */}
                  <div className={styles.childRow} style={{ cursor: 'default' }}>
                    <span className={styles.childLabel} style={{ opacity: 0.5 }}>
                      Coming soon...
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Crypto Section */}
            <div>
              <div
                className={`${styles.sectionHeader} ${isCryptoExpanded ? styles.expanded : ''}`}
                onClick={() => setIsCryptoExpanded(!isCryptoExpanded)}
              >
                <span className={styles.sectionLabel}>Crypto</span>
                <ChevronIcon className={styles.chevronIcon} />
              </div>
              <div className={`${styles.childrenList} ${isCryptoExpanded ? styles.open : ''}`}>
                <div className={styles.childrenInner}>{renderCryptoList()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupportModal