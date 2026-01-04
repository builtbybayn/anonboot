import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import styles from './PaymentModal.module.css'
import { BackIcon, CopyIcon, CheckIcon } from './Icons'

// Module-level cache for QR codes
const qrCache = new Map()

const ASSET_COLORS = {
  btc: '#F7931A',
  eth: '#627EEA',
  sol: '#A364FC',
  usdc: '#2775CA',
  usdt: '#53AE94',
  ltc: '#497ED1'
}

const PaymentModal = ({ isOpen, onBack, onClose, title, assetId, address, networkId }) => {
  const [qrSrc, setQrSrc] = useState('')
  const [copied, setCopied] = useState(false)

  // QR Generation & Caching
  useEffect(() => {
    if (!isOpen || !address) return

    const key = `${assetId}:${networkId || 'default'}:${address}`
    
    if (qrCache.has(key)) {
      setQrSrc(qrCache.get(key))
    } else {
      QRCode.toDataURL(address, {
        width: 200,
        margin: 0,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
        .then((url) => {
          qrCache.set(key, url)
          setQrSrc(url)
        })
        .catch((err) => {
          console.error('QR Generation failed', err)
        })
    }
  }, [isOpen, address, assetId, networkId])

  // Reset copied state on open/address change
  useEffect(() => {
    if (isOpen) setCopied(false)
  }, [isOpen, address])

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

  const handleCopy = () => {
    if (!address) return
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    })
  }

  const accentColor = ASSET_COLORS[assetId] || '#FFFFFF'

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onBack} aria-label="Back">
            <BackIcon className={styles.backIcon} />
          </button>
          <div className={styles.title}>{title}</div>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.topSection}>
            {/* QR Panel */}
            <div className={styles.qrContainer}>
              {qrSrc ? (
                <img src={qrSrc} alt="QR Code" className={styles.qrImage} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: '#eee' }} />
              )}
            </div>

            {/* Message Panel */}
            <div className={styles.messagePanel}>
              <p className={styles.message}>
                Thank you. Support helps maintain and improve anonBOOT.
              </p>
            </div>
          </div>

          {/* Instruction */}
          <div>
            <div className={styles.instruction}>
              Send <span style={{ color: accentColor, fontWeight: 600 }}>{title}</span> to this address:
            </div>

            {/* Address Row */}
            <div className={styles.addressRow} onClick={handleCopy} title="Click to copy">
              <span className={styles.addressText}>
                {address || 'Address unavailable'}
              </span>
              {copied ? (
                <>
                  <span className={styles.copiedFeedback}>Copied</span>
                  <CheckIcon className={styles.copyIcon} style={{ color: '#4cd964' }} />
                </>
              ) : (
                <CopyIcon className={styles.copyIcon} />
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className={styles.disclaimer}>
            Always verify addresses before sending funds.
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
