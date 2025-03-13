import { useEffect, useState } from 'react'
import DocumentViewer from './components/DocumentViewer'
import Sidebar from './components/Sidebar'

function App(): JSX.Element {
  const [selectedDirectory, setSelectedDirectory] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [defaultDirectory, setDefaultDirectory] = useState<string | null>(null) //Add a default directory state.

  useEffect(() => {
    const getInitialDirectory = async (): Promise<void> => {
      const initialDefaultDirectory = await window.api.getDefaultDirectory()
      setDefaultDirectory(initialDefaultDirectory) // store the default directory
      const storedPath = await window.api.getStoredPath()

      if (storedPath) {
        setSelectedDirectory(storedPath)
      } else {
        setSelectedDirectory(null)
      }
    }
    getInitialDirectory()
  }, [])

  const handleFileSelect = (filePath: string): void => {
    setSelectedFile(filePath)
  }
  const handleDirectorySelect = async (): Promise<void> => {
    const path = await window.api.openDirectoryDialog()
    if (path) {
      window.api.storePath(path)
      setSelectedDirectory(path)
    } else if (!selectedDirectory) {
      if (defaultDirectory) {
        window.api.storePath(defaultDirectory)
        setSelectedDirectory(defaultDirectory)
      }
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar directoryPath={selectedDirectory} onFileSelect={handleFileSelect} />
      {/* Only render DocumentViewer if a file is selected */}
      <div style={{ flexGrow: 1, padding: '1rem' }}>
        <h1>App.tsx</h1>
        <button onClick={handleDirectorySelect}>Select Directory</button>
        {selectedFile && <DocumentViewer filePath={selectedFile} />}
      </div>
    </div>
  )
}

export default App
