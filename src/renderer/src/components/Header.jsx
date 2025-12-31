import { useState, useEffect } from 'react'
import styles from './Header.module.css'
import checkmarkIcon from '../assets/check-mark.svg'
import { UndoIcon, RedoIcon, RefreshIcon, SpinnerIcon } from './Icons'
import ModeSelector from './ModeSelector'

const Header = ({
  currentMode,
  setMode,
  isLoading,
  scrollRef,
  onRefresh,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return
      const scrollTop = scrollRef.current.scrollTop

      if (scrollTop > 20 && !isCollapsed) {
        setIsCollapsed(true)
      } else if (scrollTop < 10 && isCollapsed) {
        setIsCollapsed(false)
      }
    }

    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', handleScroll)
      handleScroll()
    }

    return () => {
      if (el) el.removeEventListener('scroll', handleScroll)
    }
  }, [scrollRef, isCollapsed])

  return (
    <header className={`${styles.header} ${isCollapsed ? styles.collapsed : styles.expanded}`}>
      {/* Left Cluster: Undo / Redo */}
      <div className={styles.leftCluster}>
        <button
          className={styles.iconBtn}
          aria-label="Undo"
          onClick={onUndo}
          disabled={isLoading || !canUndo}
          style={{ opacity: !canUndo ? 0.3 : 1, cursor: !canUndo ? 'default' : 'pointer' }}
        >
          <UndoIcon className={styles.icon} />
        </button>
        <button
          className={styles.iconBtn}
          aria-label="Redo"
          onClick={onRedo}
          disabled={isLoading || !canRedo}
          style={{ opacity: !canRedo ? 0.3 : 1, cursor: !canRedo ? 'default' : 'pointer' }}
        >
          <RedoIcon className={styles.icon} />
        </button>
      </div>

      {/* Center Cluster: Logo & Mode Selector */}
      <div className={styles.centerCluster}>
        <div className={styles.logoContainer}>
          <span className={styles.textLogo}>anonBOOT</span>
        </div>
        {!isCollapsed && <ModeSelector currentMode={currentMode} setMode={setMode} />}
      </div>

      {/* Right Cluster: Status & Refresh */}
      <div className={styles.rightCluster}>
        <div
          className={styles.statusContainer}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {isLoading ? (
            <SpinnerIcon className={styles.spinner} />
          ) : (
            <img src={checkmarkIcon} className={styles.checkmark} alt="Synced" />
          )}
          {showTooltip && !isLoading && (
            <div className={styles.tooltip}>Your information is up to date.</div>
          )}
        </div>

        <button
          className={`${styles.iconBtn} ${isLoading ? styles.refreshing : ''}`}
          onClick={onRefresh}
          disabled={isLoading}
          title="Refresh State"
        >
          <RefreshIcon className={styles.icon} />
        </button>

        {isCollapsed && (
          <ModeSelector currentMode={currentMode} setMode={setMode} variant="hamburger" />
        )}
      </div>
    </header>
  )
}

export default Header
