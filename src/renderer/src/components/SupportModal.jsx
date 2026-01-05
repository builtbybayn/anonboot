import { useState, useEffect } from 'react'
import styles from './SupportModal.module.css'
import {
  XIcon,
  ChevronIcon,
  UsdcIcon,
  BtcIcon,
  EthIcon,
  SolIcon,
  UsdtIcon,
  LtcIcon,
  UsdcOnEthIcon,
  UsdcOnSolIcon,
  UsdtOnEthIcon,
  UsdtOnSolIcon,
  CardIcon,
  WalletIcon,
  PayPalIcon
} from './Icons'

const ICON_MAP = {
  usdc: UsdcIcon,
  btc: BtcIcon,
  eth: EthIcon,
  sol: SolIcon,
  usdt: UsdtIcon,
  ltc: LtcIcon,
  card: CardIcon,
  wallets: WalletIcon,
  paypal: PayPalIcon
}

const NETWORK_ICON_MAP = {
  'usdc:ethereum': UsdcOnEthIcon,
  'usdc:solana': UsdcOnSolIcon,
  'usdt:ethereum': UsdtOnEthIcon,
  'usdt:solana': UsdtOnSolIcon
}

const SupportModal = ({ isOpen, onClose, onOpenPayment, isCovered }) => {
  const [isTraditionalExpanded, setIsTraditionalExpanded] = useState(false)
  const [isCryptoExpanded, setIsCryptoExpanded] = useState(false)
  const [supportData, setSupportData] = useState(null)
  const [expandedItems, setExpandedItems] = useState({})

  // Load Data
  useEffect(() => {
    const load = async () => {
      try {
        const data = await window.api.getSupportData()
        if (data) {
          setSupportData(data)
        }
        // Attempt background refresh
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

  const toggleItemExpansion = (assetId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [assetId]: !prev[assetId]
    }))
  }

  const handleNetworkClick = (item, network) => {
    let title = network.label
    if (!title) {
      if (item.label.toLowerCase() === network.networkId.toLowerCase()) {
        title = item.label
      } else {
        title = `${item.label} on ${network.networkId}`
      }
    }

    onOpenPayment({
      assetId: item.assetId,
      networkId: network.networkId,
      title,
      address: network.address
    })
  }

  const handleTraditionalClick = (item) => {
    if (item.url) {
      window.api.openExternal(item.url)
    }
  }

  const renderTraditionalList = () => {
    if (!supportData || !supportData.traditional) {
      return (
        <div className={styles.childRow} style={{ cursor: 'default' }}>
          <span className={styles.childLabel} style={{ opacity: 0.5 }}>
            Coming soon...
          </span>
        </div>
      )
    }

    return (
      <>
        <div className={styles.helperText}>Opens secure payment in your browser</div>
        {supportData.traditional.map((item) => {
          const IconComponent = ICON_MAP[item.methodId]
          return (
            <div
              key={item.methodId}
              className={styles.childRow}
              onClick={() => handleTraditionalClick(item)}
            >
              <span className={styles.childLabel}>{item.label}</span>
              {IconComponent && <IconComponent className={styles.childIcon} />}
            </div>
          )
        })}
      </>
    )
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
      const hasMultipleNetworks = item.networks && item.networks.length > 1
      const isExpanded = expandedItems[item.assetId]

      if (hasMultipleNetworks) {
        return (
          <div key={item.assetId}>
            {/* Parent Row */}
            <div className={styles.childRow} onClick={() => toggleItemExpansion(item.assetId)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={styles.childLabel}>
                  {item.label}
                </span>
                <ChevronIcon
                  className={styles.chevronIcon}
                  style={{
                    transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
                    width: '16px',
                    height: '16px'
                  }}
                />
              </div>
              {IconComponent && <IconComponent className={styles.childIcon} />}
            </div>

            {/* Nested Networks */}
            <div
              className={`${styles.childrenList} ${isExpanded ? styles.open : ''}`}
              style={{ paddingLeft: '0' }}
            >
              <div className={styles.childrenInner}>
                {item.networks.map((net) => {
                  const NetworkIcon = NETWORK_ICON_MAP[`${item.assetId}:${net.networkId}`]
                  return (
                    <div
                      key={net.networkId}
                      className={styles.childRow}
                      style={{ paddingLeft: '64px' }} // Extra indent for nested items
                      onClick={() => handleNetworkClick(item, net)}
                    >
                      <span className={styles.childLabel}>{net.label || net.networkId}</span>
                      {NetworkIcon && <NetworkIcon className={styles.childIcon} />}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )
      } else {
        // Single Network
        const network = item.networks ? item.networks[0] : null
        if (!network) return null

        return (
          <div
            key={item.assetId}
            className={styles.childRow}
            onClick={() => handleNetworkClick(item, network)}
          >
            <span className={styles.childLabel}>{item.label}</span>
            {IconComponent && <IconComponent className={styles.childIcon} />}
          </div>
        )
      }
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
              <div
                className={`${styles.childrenList} ${isTraditionalExpanded ? styles.open : ''}`}
              >
                <div className={styles.childrenInner}>{renderTraditionalList()}</div>
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
