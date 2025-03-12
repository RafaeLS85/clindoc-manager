import type { IpcMain } from 'electron'
import { dialog } from 'electron'
import * as fs from 'fs'
import * as path from 'path'

const getStoredPath = async (): Promise<string | null> => {
  const filePath = path.join(process.cwd(), 'path.txt')
  if (fs.existsSync(filePath)) {
    return fs.promises.readFile(filePath, 'utf-8')
  }
  return null
}

const storePath = async (newPath: string): Promise<void> => {
  const filePath = path.join(process.cwd(), 'path.txt')
  await fs.promises.writeFile(filePath, newPath, 'utf-8')
}

const openDirectoryDialog = async (): Promise<string | undefined> => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  })
  return result.canceled ? undefined : result.filePaths[0]
}

export function setupSystemHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('get-versions', () => {
    return process.versions
  })

  ipcMain.handle('get-current-date', () => {
    const currentDate = new Date().toLocaleDateString()
    return currentDate
  })
  ipcMain.handle('system:get-stored-path', getStoredPath)
  ipcMain.handle('system:store-path', (_, newPath: string) => storePath(newPath))
  ipcMain.handle('system:open-directory-dialog', openDirectoryDialog)
}
