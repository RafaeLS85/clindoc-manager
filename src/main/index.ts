import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
// import mammoth from 'mammoth'
import fs from 'fs/promises'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  //Este método registra un manejador para eventos enviados desde el proceso renderer mediante ipcRenderer.send().
  ipcMain.on('ping', () => console.log('pong'))

  // Ejemplo de canal IPC para leer archivos DOCX utilizando Mammoth.js.
  // ipcMain.handle('read-docx', async (event, filePath: string) => {
  //   try {
  //     const result = await mammoth.convertToHtml({ path: filePath })
  //     return result.value
  //   } catch (error) {
  //     console.error('Error al leer archivo DOCX:', error)
  //     throw error
  //   }
  // })

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

  ipcMain.handle('get-versions', () => {
    return process.versions
  })

  ipcMain.handle('get-current-date', () => {
    const currentDate = new Date().toLocaleDateString()
    return currentDate
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
