import { useState, useRef, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { InfoIcon } from './Icons'

const Tooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [style, setStyle] = useState({ top: 0, left: 0, opacity: 0 })
  const [placement, setPlacement] = useState('top')
  
  const containerRef = useRef(null)
  const tooltipRef = useRef(null)

  useLayoutEffect(() => {
    if (!isVisible || !containerRef.current || !tooltipRef.current) return

    const iconRect = containerRef.current.getBoundingClientRect()
    const tooltipRect = tooltipRef.current.getBoundingClientRect()
    const padding = 10 // Spacing between icon and tooltip
    const safeMargin = 10 // Spacing from screen edges

    const winW = window.innerWidth
    const winH = window.innerHeight

    // Calculate potential positions
    // Note: Transform is handled in CSS/Inline style logic. 
    // We calculate "anchor" points here assuming transform handles centering.
    
    // Top: Above icon, centered horizontally
    // Transform: translate(-50%, -100%)
    const posTop = {
      top: iconRect.top - padding,
      left: iconRect.left + iconRect.width / 2,
      check: () => 
        iconRect.top - tooltipRect.height - padding > safeMargin &&
        iconRect.left + iconRect.width/2 - tooltipRect.width/2 > safeMargin &&
        iconRect.left + iconRect.width/2 + tooltipRect.width/2 < winW - safeMargin
    }

    // Right: Right of icon, centered vertically
    // Transform: translate(0, -50%)
    const posRight = {
      top: iconRect.top + iconRect.height / 2,
      left: iconRect.right + padding,
      check: () =>
        iconRect.right + tooltipRect.width + padding < winW - safeMargin &&
        iconRect.top + iconRect.height/2 - tooltipRect.height/2 > safeMargin &&
        iconRect.top + iconRect.height/2 + tooltipRect.height/2 < winH - safeMargin
    }

    // Bottom: Below icon, centered horizontally
    // Transform: translate(-50%, 0)
    const posBottom = {
      top: iconRect.bottom + padding,
      left: iconRect.left + iconRect.width / 2,
      check: () =>
        iconRect.bottom + tooltipRect.height + padding < winH - safeMargin &&
        iconRect.left + iconRect.width/2 - tooltipRect.width/2 > safeMargin &&
        iconRect.left + iconRect.width/2 + tooltipRect.width/2 < winW - safeMargin
    }

    // Left: Left of icon, centered vertically
    // Transform: translate(-100%, -50%)
    const posLeft = {
      top: iconRect.top + iconRect.height / 2,
      left: iconRect.left - padding,
      check: () =>
        iconRect.left - tooltipRect.width - padding > safeMargin &&
        iconRect.top + iconRect.height/2 - tooltipRect.height/2 > safeMargin &&
        iconRect.top + iconRect.height/2 + tooltipRect.height/2 < winH - safeMargin
    }

    let finalPlacement = 'top'
    let finalPos = posTop

    // Priority: Top -> Right -> Bottom -> Left
    if (posTop.check()) {
      finalPlacement = 'top'
      finalPos = posTop
    } else if (posRight.check()) {
      finalPlacement = 'right'
      finalPos = posRight
    } else if (posBottom.check()) {
      finalPlacement = 'bottom'
      finalPos = posBottom
    } else if (posLeft.check()) {
      finalPlacement = 'left'
      finalPos = posLeft
    } else {
      // Fallback: Pick Top or Right based on vertical space
      if (iconRect.top > winH / 2) {
        finalPlacement = 'top' // Force top if in bottom half
        finalPos = posTop
      } else {
        finalPlacement = 'bottom' // Force bottom if in top half
        finalPos = posBottom
      }
      // Can add clamping logic here if needed, but simple flip is usually enough.
    }

    setPlacement(finalPlacement)
    setStyle({
      top: finalPos.top,
      left: finalPos.left,
      opacity: 1
    })

  }, [isVisible, text])

  const getTransform = (p) => {
    switch (p) {
      case 'top': return 'translate(-50%, -100%)'
      case 'bottom': return 'translate(-50%, 0)'
      case 'left': return 'translate(-100%, -50%)'
      case 'right': return 'translate(0, -50%)'
      default: return 'translate(-50%, -100%)'
    }
  }

  return (
    <>
      <div
        className="tooltip-container"
        ref={containerRef}
        onMouseEnter={() => {
            setStyle({ ...style, opacity: 0 }) // Reset for measurement
            setIsVisible(true)
        }}
        onMouseLeave={() => setIsVisible(false)}
      >
        <InfoIcon className="info-icon" />
      </div>
      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`tooltip-bubble ${placement}`}
            style={{
              position: 'fixed',
              top: style.top,
              left: style.left,
              opacity: style.opacity,
              transform: getTransform(placement),
              zIndex: 9999,
              bottom: 'auto',
              right: 'auto',
              transition: 'opacity 0.1s ease'
            }}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  )
}

export default Tooltip
