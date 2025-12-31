import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  checkAdmin: () => ipcRenderer.invoke('app:checkAdmin'),
  detectAll: () => ipcRenderer.invoke('app:detectAll'),
  detectState: () => ipcRenderer.invoke('app:detectState'),
  applyAll: () => ipcRenderer.invoke('app:applyAll'),
  revertAll: () => ipcRenderer.invoke('app:revertAll'),
  getSchema: () => ipcRenderer.invoke('app:getSchema'),
  getState: () => ipcRenderer.invoke('app:getState'),
  toggleSetting: (category, id, value) =>
    ipcRenderer.invoke('app:toggleSetting', category, id, value),
  detectSetting: (category, id) => ipcRenderer.invoke('app:detectSetting', category, id),
  undo: () => ipcRenderer.invoke('app:undo'),
  redo: () => ipcRenderer.invoke('app:redo'),
  getHistoryCounts: () => ipcRenderer.invoke('app:getHistoryCounts')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}