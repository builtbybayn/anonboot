import { useState } from 'react'
import ConfigItem from './ConfigItem'
import styles from './ConfigGroup.module.css'

const ConfigGroup = ({ category, configState, toggleItem }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  // Check if all children are enabled
  const areAllChildrenEnabled = category.children.every((child) => configState[child.id])

  const handleParentToggle = () => {
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
      />

      <div className={`${styles.childrenContainer} ${isExpanded ? styles.open : ''}`}>
        <div className={styles.childrenInner}>
          {category.children.map((child) => (
            <ConfigItem
              key={child.id}
              label={child.label}
              description={child.description}
              isEnabled={configState[child.id] || false}
              onToggle={() => toggleItem([child.id], !configState[child.id])}
              isChild={true}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConfigGroup
