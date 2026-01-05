import { useState, useEffect, useRef } from 'react'
import styles from './Header.module.css'
import checkmarkIcon from '../assets/check-mark.svg'
import logoIcon from '../assets/anonboot-logo-icon.svg'
import { UndoIcon, RedoIcon, RefreshIcon, SpinnerIcon } from './Icons'
import ModeSelector from './ModeSelector'
import RevertButton from './RevertButton'
import HamburgerMenu from './HamburgerMenu'

const Header = ({
  currentMode,
  setMode,
  isLoading,
  scrollRef,
  onRefresh,
  onUndo,
  onRedo,
  onRevertAll,
  canUndo,
  canRedo
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const isLocked = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || isLocked.current) return
      const scrollTop = scrollRef.current.scrollTop

      if (scrollTop > 20 && !isCollapsed) {
        isLocked.current = true
        setIsCollapsed(true)
        setTimeout(() => (isLocked.current = false), 400)
      } else if (scrollTop < 10 && isCollapsed) {
        isLocked.current = true
        setIsCollapsed(false)
        setTimeout(() => (isLocked.current = false), 400)
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

      {/* Center Cluster: Logo ONLY */}
      <div className={styles.centerCluster}>
        <div className={styles.logoContainer}>
          <span className={styles.textLogo}>anonBOOT</span>
          <img src={logoIcon} className={styles.logoIcon} alt="" />
        </div>
      </div>

      {/* Right Cluster: Status & Refresh & Actions */}
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

        {/* Action Group: Mode -> Revert -> Hamburger */}

        {/* Inline Mode (Collapses first) */}
        <div className={styles.inlineMode}>
          <ModeSelector currentMode={currentMode} setMode={setMode} />
        </div>

        {/* Inline Revert (Collapses second, kept visible longer) */}
        <div className={styles.inlineRevert}>
          {/* RevertButton likely needs disabled prop if supported, or wrap in div/style */}
          <div style={{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}>
            <RevertButton onRevert={onRevertAll} />
          </div>
        </div>

        {/* Hamburger (Appears when any item collapses) */}
        <div className={styles.hamburgerMenu}>
          <HamburgerMenu>
            {/* Menu Mode (Visible when inline Mode hidden) */}
            <div className={styles.menuItemMode}>
              <ModeSelector currentMode={currentMode} setMode={setMode} variant="submenu" />
            </div>

            {/* Menu Revert (Visible when inline Revert hidden) */}
            <div className={styles.menuItemRevert}>
              <button
                className={styles.menuItem}
                onClick={onRevertAll}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'default' : 'pointer' }}
              >
                Revert All
              </button>
            </div>
          </HamburgerMenu>
        </div>
      </div>
    </header>
  )
}

export default Header
