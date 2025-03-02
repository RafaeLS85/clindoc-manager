import React, { useState } from 'react'

const DocumentViewer: React.FC = () => {
  const [fileTitle, setFileTitle] = useState<string>('')
  const [fileContent, setFileContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setFileContent('')

    const file = event.target.files && event.target.files[0]
    if (file && (file as any).path) {
      const filePath: string = (file as any).path
      const title = file.name.replace(/\.[^/.]+$/, '')
      setFileTitle(title)

      console.log('File path:', filePath)
      console.log('File title:', title)

      try {
        setLoading(true)
        const content: string = await window.api.readTextFile(filePath)
        console.log('Content received from readTextFile:', content)
        setFileContent(content)
      } catch (err: any) {
        console.error('Error reading file:', err)
        setError('Failed to read file.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Select a Document</h2>
      <input type="file" accept=".txt" onChange={handleFileChange} />

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
