import type { IpcMain } from 'electron'
import fs from 'fs/promises'
import mammoth from 'mammoth'

export function setupFileHandlers(ipcMain: IpcMain): void {
  ipcMain.handle('read-text-file', async (event, filePath: string) => {
    console.log('read-text-file called with path:', filePath)
    try {
      const data = await fs.readFile(filePath, 'utf-8')
      console.log('File content:', data)
      return data
    } catch (error) {
      console.error('Error reading file:', error)
      throw error
    }
  })

  ipcMain.handle('read-docx', async (event, filePath: string) => {
    try {
      const result = await mammoth.convertToHtml({ path: filePath })
      return result.value
    } catch (error) {
      console.error('Error al leer archivo DOCX:', error)
      throw error
    }
  })
}
