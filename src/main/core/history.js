// src/main/core/history.js

const undoStack = []
const redoStack = []
const MAX_STACK_SIZE = 50

export const pushAction = (action) => {
  // Add to undo stack
  undoStack.push(action)
  
  // Limit stack size
  if (undoStack.length > MAX_STACK_SIZE) {
    undoStack.shift() // Remove oldest
  }

  // Clear redo stack on new action
  redoStack.length = 0
}

export const popUndo = () => {
  return undoStack.pop()
}

export const pushUndo = (action) => {
    undoStack.push(action)
}

export const popRedo = () => {
  return redoStack.pop()
}

export const pushRedo = (action) => {
  redoStack.push(action)
}

export const getCounts = () => {
  return {
    undo: undoStack.length,
    redo: redoStack.length
  }
}

export const clearHistory = () => {
    undoStack.length = 0
    redoStack.length = 0
}
