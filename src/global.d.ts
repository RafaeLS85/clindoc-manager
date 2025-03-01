// src/renderer/global.d.ts
import { API } from './types/api'
import type { electronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: typeof electronAPI
    api: API
  }
}

export {}
