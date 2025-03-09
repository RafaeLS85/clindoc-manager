import { dialog, type IpcMain } from 'electron'
import fs from 'fs/promises'
import mammoth from 'mammoth'
import { FileFilter } from '../../types/api'

export function setupFileHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('open-file-dialog', async (_event, filters?: FileFilter[]) => {
    // Use provided filters or default to all files
    const usedFilters: FileFilter[] = filters ?? [{ name: 'All Files', extensions: ['*'] }]

    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: usedFilters // Use the provided filters
    })

    if (canceled) {
      return null
    } else {
      return filePaths[0]
    }
  })
  ipcMain.handle('read-text-file', async (_event, filePath: string) => {
    console.log('4) read-text-file called with path:', filePath)
    try {
      const data = await fs.readFile(filePath, 'utf-8')
      console.log('File content:', data)
      return data
    } catch (error) {
      console.error('Error reading file:', error)
      throw error
    }
  })

  ipcMain.handle('read-docx', async (_event, filePath: string) => {
    try {
      const result = await mammoth.convertToHtml({ path: filePath })
      return result.value
    } catch (error) {
      console.error('Error al leer archivo DOCX:', error)
      throw error
    }
  })
}
