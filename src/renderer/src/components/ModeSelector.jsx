import { useState, useRef, useEffect } from 'react'
import styles from './ModeSelector.module.css'
import { ChevronIcon, MenuIcon } from './Icons'

const ModeSelector = ({ currentMode, setMode, variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const modes = [
    { id: 'standard', label: 'Standard' },
    { id: 'paranoid', label: 'Paranoid' },
    { id: 'custom', label: 'Custom' }
  ]

  const currentLabel = modes.find((m) => m.id === currentMode)?.label || 'Custom'

  const toggleOpen = () => setIsOpen(!isOpen)

  const handleSelect = (id) => {
    setMode(id)
    setIsOpen(false)
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    // Esc key to close
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      window.addEventListener('keydown', handleEsc)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen])

  if (variant === 'hamburger') {
    return (
      <div className={styles.container} ref={containerRef}>
        <button
          className={`${styles.hamburgerBtn} ${isOpen ? styles.active : ''}`}
          onClick={toggleOpen}
          aria-label="Mode Menu"
        >
          <MenuIcon className={styles.icon} />
        </button>

        <div className={`${styles.dropdownMenuWrapper} ${styles.dropdownMenuRight} ${isOpen ? styles.open : ''}`}>
          <div className={styles.dropdownMenuInner}>
            {modes.map((mode) => (
              <button
                key={mode.id}
                className={`${styles.menuItem} ${currentMode === mode.id ? styles.active : ''}`}
                onClick={() => handleSelect(mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.selectorBox} onClick={toggleOpen}>
        <span className={styles.label}>
          Mode: <span className={styles.modeName}>{currentLabel}</span>
        </span>
        <ChevronIcon className={`${styles.chevron} ${isOpen ? styles.open : ''}`} />
      </div>

      <div className={`${styles.dropdownMenuWrapper} ${isOpen ? styles.open : ''}`}>
        <div className={styles.dropdownMenuInner}>
          {modes.map((mode) => (
            <button
              key={mode.id}
              className={`${styles.menuItem} ${currentMode === mode.id ? styles.active : ''}`}
              onClick={() => handleSelect(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ModeSelector
