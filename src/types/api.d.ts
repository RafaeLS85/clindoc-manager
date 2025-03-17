import type { Result } from 'mammoth'

export interface FileFilter {
  name: string
  extensions: string[]
}

export interface CreateFileResult {
  success: boolean
  message?: string
  error?: any
}

export interface FileStat {
  dev: number
  mode: number
  nlink: number
  uid: number
  gid: number
  rdev: number
  blksize: number
  ino: number
  size: number
  blocks: number
  atimeMs: number
  mtimeMs: number
  ctimeMs: number
  birthtimeMs: number
  atime: string
  mtime: string
  ctime: string
  birthtime: string
  isDirectory: () => boolean
  isFile: () => boolean
}

declare global {
  interface Window {
    api: {
      openFileDialog: (fileFilter: FileFilter[]) => Promise<string | undefined>
      readTextFile: (filePath: string) => Promise<string>
      saveTextFile: (filePath: string, content: string) => Promise<void>
      readDirectory: (directoryPath: string) => Promise<string[]>
      getStoredPath: () => Promise<string | null>
      storePath: (newPath: string) => Promise<void>
      openDirectoryDialog: () => Promise<string | undefined>
      startWatching: (directoryPath: string) => void
      stopWatching: () => void
      onDirectoryChanged: (callback: (event: any, path: string) => void) => void
      removeDirectoryChangedListener: (callback: (event: any, path: string) => void) => void
      getDefaultDirectory: () => Promise<string>
      createFile: (filePath: string) => Promise<CreateFileResult>
      readDocx: (filePath: string) => Promise<Result>
      existsDirectory: (path: string) => Promise<boolean>
      createDirectory: (path: string) => Promise<void>
      isDirectory: (directoryPath: string, fileName: string) => Promise<boolean>
      getFileStat: (directoryPath: string, fileName: string) => Promise<FileStat | null>
    }
  }
}
