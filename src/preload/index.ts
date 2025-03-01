import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { API } from '../types/api'

// Custom APIs for renderer, ahora con readDocx
const api: API = {
  readDocx: (filePath: string): Promise<string> => {
    // ipcRenderer.invoke devuelve una Promise, la cual se resolverá con la respuesta
    return ipcRenderer.invoke('read-docx', filePath)
  }
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
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
