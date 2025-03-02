import { contextBridge, ipcRenderer } from 'electron'
import type { API } from '../types/api'

const api: API = {
  readDocx: (filePath: string): Promise<string> => {
    console.log('Invoking read-docx from renderer with path:', filePath)
    return ipcRenderer.invoke('read-docx', filePath) as Promise<string>
  },
  readTextFile: (filePath: string): Promise<string> => {
    console.log('Invoking read-text-file from renderer with path:', filePath)
    return ipcRenderer.invoke('read-text-file', filePath) as Promise<string>
  },
  getVersions: (): Promise<{ chrome: string; node: string; electron: string }> => {
    return ipcRenderer.invoke('get-versions')
  },
  getCurrentDate: (): Promise<string> => {
    return ipcRenderer.invoke('get-current-date')
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error('Error exposing API:', error)
  }
} else {
  ;(window as any).api = api
}
