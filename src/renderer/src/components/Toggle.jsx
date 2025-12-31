import styles from './Toggle.module.css'

const Toggle = ({ checked, onChange, disabled }) => {
  return (
    <label className={styles.container}>
      <input
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <div className={styles.track}>
        <div className={styles.thumb} />
      </div>
    </label>
  )
}

export default Toggle
