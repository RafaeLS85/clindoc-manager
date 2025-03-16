import { useEffect, useState } from 'react'

interface ReturnValues {
  files: string[]
  searchTerm: string
  newFileName: string
  createError: string | null
  creating: boolean
  createNewFile: boolean
  filteredFiles: string[]
  getFolderName: (path: string | null) => string
  handleNewFileNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleCreateFile: () => void
  handleFileClick: (fileName: string) => void
  setCreateNewFile: React.Dispatch<React.SetStateAction<boolean>>
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

interface UseSideBarProps {
  directoryPath: string | null
  onFileSelect: (filePath: string) => void
}
export const useSideBar = ({ directoryPath, onFileSelect }: UseSideBarProps): ReturnValues => {
  const [files, setFiles] = useState<string[]>([])
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [newFileName, setNewFileName] = useState<string>('')
  const [createError, setCreateError] = useState<string | null>(null)
  const [creating, setCreating] = useState<boolean>(false)
  const [createNewFile, setCreateNewFile] = useState<boolean>(false)

  useEffect(() => {
    const loadFiles = async (): Promise<void> => {
      if (directoryPath) {
        try {
          const fileList = await window.api.readDirectory(directoryPath)
          setFiles(fileList)
          setPreviousPath(directoryPath)
        } catch (error) {
          console.error('Error reading directory:', error)
          setFiles([])
        }
      } else {
        if (previousPath !== null) {
          setFiles([])
          setPreviousPath(null)
        }
      }
    }

    loadFiles()
  }, [directoryPath, previousPath])

  const handleFileClick = (fileName: string): void => {
    // en el caso de ser una carpeta? como validar?
    if (!fileName.includes('.')) return // TODO: recorrer la lista de archivos dentro de la carpeta.

    if (directoryPath) {
      const filePath = `${directoryPath}\\${fileName}`
      onFileSelect(filePath)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(event.target.value)
  }

  const filteredFiles = files.filter((file) =>
    file.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFolderName = (path: string | null): string => {
    if (!path) return ''
    const parts = path.split('\\') // Assuming Windows-style paths; adjust if needed
    return parts.pop() || ''
  }

  const handleCreateFile = async (): Promise<void> => {
    if (!directoryPath) {
      setCreateError('No directory selected')
      return
    }
    if (!newFileName) {
      setCreateError('File name is required')
      return
    }
    setCreating(true)
    setCreateError(null)

    try {
      const filePath = `${directoryPath}\\${newFileName}.docx` // You may change the extencion in the future.
      await window.api.createFile(filePath)
      setFiles([...files, `${newFileName}.docx`]) //update the file list
      setNewFileName('')
    } catch (err: any) {
      setCreateError(`Failed to create file. Error: ${err.message}`)
    } finally {
      setCreating(false)
    }
  }

  const handleNewFileNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setNewFileName(event.target.value)
    setCreateError(null)
  }
  return {
    files,
    searchTerm,
    newFileName,
    createError,
    creating,
    createNewFile,
    filteredFiles,
    getFolderName,
    handleNewFileNameChange,
    handleCreateFile,
    handleFileClick,
    setCreateNewFile,
    handleSearchChange
  }
}
