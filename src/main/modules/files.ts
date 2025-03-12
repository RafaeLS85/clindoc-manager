import type { IpcMain } from 'electron'
import { dialog } from 'electron'
import * as fs from 'fs'
// import * as path from 'path'
import { FileFilter } from '../../types/api'

const openFileDialog = async (filters?: FileFilter[]): Promise<string | undefined> => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters
  })

  return result.canceled ? undefined : result.filePaths[0]
}
const readTextFile = async (filePath: string): Promise<string> => {
  return fs.promises.readFile(filePath, 'utf-8')
}

const saveTextFile = async (filePath: string, content: string): Promise<void> => {
  await fs.promises.writeFile(filePath, content, 'utf-8')
}
const readDirectory = async (directoryPath: string): Promise<string[]> => {
  const files = await fs.promises.readdir(directoryPath)
  return files
}

export function setupFileHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('files:open-file-dialog', (_, fileFilter) => openFileDialog(fileFilter))
  ipcMain.handle('files:read-text-file', (_, filePath: string) => readTextFile(filePath))
  ipcMain.handle('files:save-text-file', (_, filePath: string, content: string) =>
    saveTextFile(filePath, content)
  )
  ipcMain.handle('files:read-directory', (_, directoryPath: string) => readDirectory(directoryPath))
}
