import React, { useEffect, useState } from 'react'

interface SidebarProps {
  directoryPath: string
  onFileSelect: (filePath: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ directoryPath, onFileSelect }) => {
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    const loadFiles = async (): Promise<void> => {
      if (directoryPath) {
        try {
          const fileList = await window.api.readDirectory(directoryPath)
          setFiles(fileList)
        } catch (error) {
          console.error('Error reading directory:', error)
          setFiles([])
        }
      } else {
        setFiles([])
      }
    }

    loadFiles()
  }, [directoryPath])

  const handleFileClick = (fileName: string): void => {
    const filePath = `${directoryPath}\\${fileName}`
    onFileSelect(filePath)
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
