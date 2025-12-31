import { useState, useRef, useEffect } from 'react'
import styles from './ModeSelector.module.css'
import { ChevronIcon } from './Icons'

const ModeSelector = ({ currentMode, setMode, variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const modes = [
    { id: 'standard', label: 'Standard' },
    { id: 'paranoid', label: 'Paranoid' },
    { id: 'custom', label: 'Custom' }
  ]

  const currentLabel = modes.find((m) => m.id === currentMode)?.label || 'Custom'

  const toggleOpen = (e) => {
    e.stopPropagation()
    setIsOpen(!isOpen)
  }

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

  if (variant === 'submenu') {
    return (
      <div className={styles.submenuContainer} ref={containerRef}>
        <button 
          className={`${styles.menuItem} ${styles.submenuTrigger} ${isOpen ? styles.active : ''}`}
          onClick={toggleOpen}
        >
          <span>Mode: {currentLabel}</span>
          <ChevronIcon className={`${styles.chevronSide} ${isOpen ? styles.open : ''}`} />
        </button>

        {/* Side Menu */}
        <div className={`${styles.sideMenuWrapper} ${isOpen ? styles.open : ''}`}>
           <div className={styles.dropdownMenuInner}>
            {modes.map((mode) => (
              <button
                key={mode.id}
                className={`${styles.menuItem} ${currentMode === mode.id ? styles.active : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(mode.id)
                }}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Default Inline Variant
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
