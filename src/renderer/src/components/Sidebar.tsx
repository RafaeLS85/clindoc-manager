import React, { useEffect, useState } from 'react'

interface SidebarProps {
  directoryPath: string | null
  onFileSelect: (filePath: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ directoryPath, onFileSelect }) => {
  const [files, setFiles] = useState<string[]>([])
  const [previousPath, setPreviousPath] = useState<string | null>(null)

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

  return (
    <div style={{ width: '250px', borderRight: '1px solid #ccc' }}>
      <h3>Files</h3>
      <ul>
        {files.map((file) => (
          <li key={file} onClick={() => handleFileClick(file)} style={{ cursor: 'pointer' }}>
            {file}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Sidebar
