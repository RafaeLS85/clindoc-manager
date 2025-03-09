import React, { useState } from 'react'
import { FileFilter } from 'src/types/api'

const DocumentViewer: React.FC = () => {
  const [fileTitle, setFileTitle] = useState<string>('')
  const [fileContent, setFileContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const txtFilter: FileFilter[] = [{ name: 'Text Files', extensions: ['txt'] }]

  const handleFileSelect = async (): Promise<void> => {
    setError('')
    setFileContent('')
    setLoading(true)

    try {
      const filePath = await window.api.openFileDialog(txtFilter)

      if (filePath) {
        const file = {
          path: filePath,
          name: filePath.split('\\').pop() as string
        }

        const title = file.name.replace(/\.[^/.]+$/, '')
        setFileTitle(title)

        console.log('File path:', filePath)
        console.log('File title:', title)

        console.log('1) Calling readTextFile with filePath: ', filePath)
        const content: string = await window.api.readTextFile(filePath)
        console.log('2) Content received from readTextFile:', content)
        setFileContent(content)
      } else {
        console.log('File selection canceled.')
        setLoading(false)
      }
    } catch (err: unknown) {
      console.error('Error reading file:', err)
      setError('Failed to read file.')
    } finally {
      if (!error) setLoading(false)
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>DocumentViewer Component</h2>
      {/*<input type="file" accept=".txt" onChange={handleFileChange} />*/}
      <button onClick={handleFileSelect}>Open File</button>

      {fileTitle && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Selected File Title:</h3>
          <p>{fileTitle}</p>
        </div>
      )}

      {loading && <p>Loading file content...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fileContent && (
        <div style={{ marginTop: '1rem' }}>
          <h3>File Content:</h3>
          <pre>{fileContent}</pre>
        </div>
      )}
    </div>
  )
}

export default DocumentViewer
