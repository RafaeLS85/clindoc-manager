export interface API {
  readDocx: (filePath: string) => Promise<string>
  readTextFile: (filePath: string) => Promise<string>
  getVersions: () => Promise<{ chrome: string; node: string; electron: string }>
  getCurrentDate: () => Promise<string>
}
