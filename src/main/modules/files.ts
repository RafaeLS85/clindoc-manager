import type { IpcMain } from 'electron'
import { dialog, app } from 'electron'
import * as fsPromises from 'fs/promises' // Import for promise-based functions
import * as fs from 'fs' // Import for synchronous functions (existsSync)
import * as path from 'path'
import { FileFilter } from '../../types/api'

const openFileDialog = async (filters?: FileFilter[]): Promise<string | undefined> => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters
  })

  return result.canceled ? undefined : result.filePaths[0]
}
const readTextFile = async (filePath: string): Promise<string> => {
  return fsPromises.readFile(filePath, 'utf-8')
}

const saveTextFile = async (filePath: string, content: string): Promise<void> => {
  await fsPromises.writeFile(filePath, content, 'utf-8')
}
const readDirectory = async (directoryPath: string): Promise<string[]> => {
  const files = await fsPromises.readdir(directoryPath)
  return files
}

const getDocumentsDirectory = (): string | null => {
  try {
    const documentsPath = app.getPath('documents')
    return documentsPath
  } catch (error) {
    console.error('Error getting documents directory:', error)
    return null
  }
}

const createAppDataDirectory = (): string => {
  const appDataPath = path.join(app.getPath('appData'), app.getName())
  if (!fs.existsSync(appDataPath)) {
    // Now use the synchronous fs
    fs.mkdirSync(appDataPath, { recursive: true })
  }
  return appDataPath
}

const getSuitableDefaultDirectory = (): string | null => {
  const documentsDir = getDocumentsDirectory()
  if (documentsDir) {
    if (!fs.existsSync(documentsDir)) {
      // Now use the synchronous fs
      return createAppDataDirectory()
    }
    return documentsDir
  }
  return createAppDataDirectory()
}

export function setupFileHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('files:open-file-dialog', (_, fileFilter) => openFileDialog(fileFilter))
  ipcMain.handle('files:read-text-file', (_, filePath: string) => readTextFile(filePath))
  ipcMain.handle('files:save-text-file', (_, filePath: string, content: string) =>
    saveTextFile(filePath, content)
  )
  ipcMain.handle('files:read-directory', (_, directoryPath: string) => readDirectory(directoryPath))
  ipcMain.handle('system:get-default-directory', () => {
    return getSuitableDefaultDirectory()
  })
  ipcMain.handle('createFile', async (_event, filePath: string) => {
    try {
      await fsPromises.writeFile(filePath, '')
      console.log(`File created successfully at ${filePath}`)
    } catch (error) {
      console.error(`Error creating file at ${filePath}:`, error)
      throw error
    }
  })
}
