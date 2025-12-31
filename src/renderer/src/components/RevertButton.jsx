import styles from './RevertButton.module.css'
import { UndoIcon } from './Icons' // Using UndoIcon as a placeholder or maybe specific Revert icon if available? 
// The user asked for "Revert All". The UndoIcon is a curved arrow back. 
// Maybe I should use a generic "Reset" icon or text?
// Spec: "Buttons (Mode selector and Revert All) should appear inline"
// "Revert All" implies a text button or an icon button with tooltip.
// I'll stick to a text/icon combo or just text for "Revert All" to make it distinct from "Undo".
// Or just an icon.
// Let's check Icons.jsx to see what we have.

const RevertButton = ({ onRevert }) => {
  return (
    <button className={styles.revertBtn} onClick={onRevert} title="Revert All Changes">
      Revert All
    </button>
  )
}

export default RevertButton
