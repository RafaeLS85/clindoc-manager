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
  isDirectory: (filename: string) => Promise<boolean>
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
  const isDirectory = async (fileName: string): Promise<boolean> => {
    if (directoryPath) {
      try {
        return await window.api.isDirectory(directoryPath, fileName)
      } catch (error) {
        console.error(`Error checking file type: ${error}`)
        return false
      }
    }
    return false
  }

  const handleFileClick = async (fileName: string): Promise<void> => {
    if (directoryPath) {
      try {
        const isDir = await window.api.isDirectory(directoryPath, fileName)
        console.log(`isDir: ${isDir}`)
        if (isDir) {
          // It's a directory
          console.log(`Clicked on directory: ${fileName}`)
          // TODO: Handle directory click appropriately (e.g., update directoryPath)
          //For now it will do nothing
          // For example:
          // setDirectoryPath(fullPath); // Assuming you have a state variable for current directory path

          return
        } else {
          // It's a file
          const fullPath = `${directoryPath}\\${fileName}` // We dont have path.join anymore
          onFileSelect(fullPath)
        }
      } catch (error) {
        console.error(`Error checking file type: ${error}`)
      }
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
      const filePath = `${directoryPath}\\${newFileName}.docx`
      const result = await window.api.createFile(filePath)
      if (result.success) {
        setFiles([...files, `${newFileName}.docx`])
        setNewFileName('')
      } else {
        setCreateError(result.error)
      }
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
    handleSearchChange,
    isDirectory
  }
}
