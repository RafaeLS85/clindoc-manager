import React, { useEffect, useState } from 'react'

interface SidebarProps {
  directoryPath: string | null
  onFileSelect: (filePath: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ directoryPath, onFileSelect }) => {
  const [files, setFiles] = useState<string[]>([])
  const [previousPath, setPreviousPath] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

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

  return (
    <div style={{ width: '250px', borderRight: '1px solid #ccc', padding: '16px' }}>
      <h3>Files</h3>
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
