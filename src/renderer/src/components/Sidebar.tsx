import React, { useEffect, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { MdAddBox } from 'react-icons/md'
interface SidebarProps {
  directoryPath: string | null
  onFileSelect: (filePath: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ directoryPath, onFileSelect }) => {
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

  return (
    <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '16px' }}>
      <h3 style={{}}>{getFolderName(directoryPath)}</h3>
      {/* <button onClick={() => setCreateNewFile(!createNewFile)}>
        {createNewFile ? 'Close' : 'New File'}
      </button> */}

      <div onClick={() => setCreateNewFile(!createNewFile)}>
        {createNewFile ? <IoMdClose /> : <MdAddBox />}
        {/* <IoIosAddCircleOutline /> */}
      </div>

      <div>
        {createNewFile && (
          <>
            <input
              type="text"
              placeholder="New file name"
              value={newFileName}
              onChange={handleNewFileNameChange}
              style={{ marginBottom: '10px', width: '100%' }}
            />
            <button onClick={handleCreateFile} disabled={creating}>
              {creating ? 'Creating...' : 'Create File'}
            </button>
          </>
        )}

        {createError && <p style={{ color: 'red' }}>{createError}</p>}
      </div>
      <input
        type="text"
        placeholder="Search files..."
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', width: '100%' }}
      />

      {searchTerm && filteredFiles.length < files.length && (
        <p style={{ fontSize: '0.8rem', color: 'gray' }}>
          {filteredFiles.length} of {files.length} files are shown
        </p>
      )}
      <ul>
        {filteredFiles.map((file) => (
          <li key={file} onClick={() => handleFileClick(file)} style={{ cursor: 'pointer' }}>
            {file}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
