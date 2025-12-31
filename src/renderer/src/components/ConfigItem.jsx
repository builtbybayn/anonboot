import Tooltip from './Tooltip'
import Toggle from './Toggle'
import styles from './ConfigItem.module.css'
import { ChevronIcon } from './Icons'

const ConfigItem = ({
  label,
  description,
  isEnabled,
  onToggle,
  hasChildren,
  isExpanded,
  onExpand,
  isChild = false
}) => {
  return (
    <div
      className={`${styles.item} ${isChild ? styles.childItem : ''}`}
      onClick={hasChildren ? onExpand : undefined}
      role={hasChildren ? 'button' : undefined}
      tabIndex={hasChildren ? 0 : undefined}
    >
      {/* 1. Label */}
      <span className={styles.label}>{label}</span>

      {/* 2. Tooltip */}
      <Tooltip text={description} />

      {/* 3. Chevron (only if has children) */}
      {hasChildren && (
        <button
          className={`${styles.chevronBtn} ${isExpanded ? styles.expanded : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onExpand()
          }}
          aria-label={isExpanded ? 'Collapse' : 'Expand'}
        >
          <ChevronIcon className={styles.chevronIcon} />
        </button>
      )}

      {/* Spacer to push toggle to right */}
      <div className={styles.spacer} />

      {/* 4. Toggle */}
      <div className={styles.toggleWrapper} onClick={(e) => e.stopPropagation()}>
        <Toggle checked={isEnabled} onChange={onToggle} />
      </div>
    </div>
  )
}

export default ConfigItem
