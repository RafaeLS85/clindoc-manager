import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { FileFilter } from '../types/api'

interface CreateFileResult {
  success: boolean
  message?: string
  error?: any
}

interface ExtractRawTextResult {
  value: string
  messages: any[]
}

export const api = {
  // Files API
  openFileDialog: async (fileFilter: FileFilter[]): Promise<string | undefined> =>
    ipcRenderer.invoke('files:open-file-dialog', fileFilter),
  readTextFile: async (filePath: string): Promise<string> =>
    ipcRenderer.invoke('files:read-text-file', filePath),
  saveTextFile: async (filePath: string, content: string): Promise<void> =>
    ipcRenderer.invoke('files:save-text-file', filePath, content),
  readDirectory: async (directoryPath: string): Promise<string[]> =>
    ipcRenderer.invoke('files:read-directory', directoryPath), // Add this
  //System API
  getStoredPath: async (): Promise<string | null> => ipcRenderer.invoke('system:get-stored-path'), // Change this
  storePath: async (newPath: string): Promise<void> =>
    ipcRenderer.invoke('system:store-path', newPath),
  openDirectoryDialog: async (): Promise<string | undefined> =>
    ipcRenderer.invoke('system:open-directory-dialog'),
  getDefaultDirectory: (): Promise<string> => {
    return ipcRenderer.invoke('system:get-default-directory')
  },
  createFile: (filePath: string): Promise<CreateFileResult> => {
    return ipcRenderer.invoke('createFile', filePath)
  },
  readDocx: async (filePath: string): Promise<ExtractRawTextResult> => {
    return await ipcRenderer.invoke('read-docx', filePath)
  },
  existsDirectory: async (path: string): Promise<boolean> => {
    return await ipcRenderer.invoke('exists-directory', path)
  },
  createDirectory: async (path: string): Promise<void> => {
    await ipcRenderer.invoke('create-directory', path)
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
