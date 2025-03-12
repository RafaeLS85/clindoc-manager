export interface FileFilter {
  name: string
  extensions: string[]
}

declare global {
  interface Window {
    api: {
      openFileDialog: (fileFilter: FileFilter[]) => Promise<string | undefined>
      readTextFile: (filePath: string) => Promise<string>
      saveTextFile: (filePath: string, content: string) => Promise<void>
      readDirectory: (directoryPath: string) => Promise<string[]> // Added this line!
      getStoredPath: () => Promise<string | null>
      storePath: (newPath: string) => Promise<void>
      openDirectoryDialog: () => Promise<string | undefined>
      startWatching: (directoryPath: string) => void
      stopWatching: () => void
      onDirectoryChanged: (callback: (event: any, path: string) => void) => void
      removeDirectoryChangedListener: (callback: (event: any, path: string) => void) => void
    }
  }
}
