import type { IpcMain } from 'electron'

export function setupSystemHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('get-versions', () => {
    return process.versions
  })

  ipcMain.handle('get-current-date', () => {
    const currentDate = new Date().toLocaleDateString()
    return currentDate
  })
}
