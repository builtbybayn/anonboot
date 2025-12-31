import { useState, useRef, useEffect } from 'react'
import styles from './HamburgerMenu.module.css'
import { MenuIcon } from './Icons'

const HamburgerMenu = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  const toggleOpen = () => setIsOpen(!isOpen)

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

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={`${styles.hamburgerBtn} ${isOpen ? styles.active : ''}`}
        onClick={toggleOpen}
        aria-label="Menu"
      >
        <MenuIcon className={styles.icon} />
      </button>

      <div className={`${styles.menuDropdown} ${isOpen ? styles.open : ''}`}>
        <div className={styles.menuInner}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default HamburgerMenu
