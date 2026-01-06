import { useState } from 'react'
import ConfigItem from './ConfigItem'
import styles from './ConfigGroup.module.css'

const ConfigGroup = ({ category, configState, toggleItem, disabled, processingItems }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Check if any child is currently processing
  const isAnyChildProcessing = category.children.some((child) => processingItems.has(child.id))

  // Check if all children are enabled
  const areAllChildrenEnabled = category.children.every((child) => configState[child.id])

  const handleParentToggle = () => {
    if (disabled || isAnyChildProcessing) return
    // If all are enabled, we want to disable all. Otherwise enable all.
    const newState = !areAllChildrenEnabled
    toggleItem(
      category.children.map((c) => c.id),
      newState
    )
  }

  return (
    <div className={styles.group}>
      <ConfigItem
        label={category.label}
        description={category.description}
        isEnabled={areAllChildrenEnabled}
        onToggle={handleParentToggle}
        hasChildren={true}
        isExpanded={isExpanded}
        onExpand={() => setIsExpanded(!isExpanded)}
        disabled={disabled || isAnyChildProcessing}
      />

      <div className={`${styles.childrenContainer} ${isExpanded ? styles.open : ''}`}>
        <div className={styles.childrenInner}>
          {category.children.map((child) => (
            <ConfigItem
              key={child.id}
              label={child.label}
              description={child.description}
              isEnabled={configState[child.id] || false}
              onToggle={() => {
                if (disabled || processingItems.has(child.id)) return
                toggleItem([child.id], !configState[child.id])
              }}
              isChild={true}
              disabled={disabled || processingItems.has(child.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConfigGroup
