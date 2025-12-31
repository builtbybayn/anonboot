import { ipcMain } from 'electron'
import { detectAllSnapshot, detectAllState, applyAll, revertAll } from '../core/scripts.js'
import { isUserAdmin } from '../core/admin.js'
import {
  getSchema,
  getState,
  toggleSetting,
  handleUserToggle,
  handleUndo,
  handleRedo,
  getHistoryCounts
} from '../core/controller.js'

export function setupHandlers() {
  ipcMain.handle('app:checkAdmin', async () => {
    return await isUserAdmin()
  })

  ipcMain.handle('app:getSchema', () => {
    return getSchema()
  })

  ipcMain.handle('app:getState', async () => {
    return await getState()
  })

  // Updated to use history-aware handler
  ipcMain.handle('app:toggleSetting', async (_, category, id, value) => {
    return await handleUserToggle(category, id, value)
  })

  ipcMain.handle('app:undo', async () => {
    return await handleUndo()
  })

  ipcMain.handle('app:redo', async () => {
    return await handleRedo()
  })

  ipcMain.handle('app:getHistoryCounts', () => {
    return getHistoryCounts()
  })

  ipcMain.handle('app:detectAll', async () => {
    return await detectAllSnapshot()
  })

  ipcMain.handle('app:detectState', async () => {
    return await detectAllState()
  })

  ipcMain.handle('app:applyAll', async () => {
    return await applyAll()
  })

  ipcMain.handle('app:revertAll', async () => {
    return await revertAll()
  })
}