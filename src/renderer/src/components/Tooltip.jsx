import { useState } from 'react'
import { InfoIcon } from './Icons'

const Tooltip = ({ text }) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="tooltip-container"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <InfoIcon className="info-icon" />
      {isVisible && <div className="tooltip-bubble">{text}</div>}
    </div>
  )
}

export default Tooltip
