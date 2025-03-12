import { useEffect, useState } from 'react'
import DocumentViewer from './components/DocumentViewer'
import Sidebar from './components/Sidebar'

function App(): JSX.Element {
  const defaultPath = 'D:\\WORKSPACE\\DESKTOP\\file-test\\test'
  const [selectedDirectory, setSelectedDirectory] = useState<string>(defaultPath)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  useEffect(() => {
    const getInitialDirectory = async (): Promise<void> => {
      const storedPath = await window.api.getStoredPath()

      if (storedPath) {
        setSelectedDirectory(storedPath)
      } else {
        window.api.storePath(defaultPath)
        setSelectedDirectory(defaultPath)
      }
    }
    getInitialDirectory()
  }, [])

  const handleFileSelect = (filePath: string): void => {
    setSelectedFile(filePath) // Reset selected file to force DocumentViewer to reload file
  }
  const handleDirectorySelect = async (): Promise<void> => {
    const path = await window.api.openDirectoryDialog()
    if (path) {
      window.api.storePath(path)
      setSelectedDirectory(path)
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar directoryPath={selectedDirectory} onFileSelect={handleFileSelect} />
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        <h1>App.tsx</h1>
        <button onClick={handleDirectorySelect}>Select Directory</button>
        <DocumentViewer filePath={selectedFile} />
      </div>
    </div>
  )
}

export default App
