import React, { useEffect, useState } from 'react'

interface DocumentViewerProps {
  filePath: string | null
}
const DocumentViewer: React.FC<DocumentViewerProps> = ({ filePath }) => {
  const [fileTitle, setFileTitle] = useState<string>('')
  const [initialFileContent, setInitialFileContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [editableContent, setEditableContent] = useState<string>('')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    setIsEditing(editableContent !== initialFileContent)
    console.log('El contenido ha cambiado')
  }, [editableContent, initialFileContent])

  useEffect(() => {
    const loadFile = async (): Promise<void> => {
      if (filePath) {
        try {
          const content = await window.api.readTextFile(filePath)
          setInitialFileContent(content)
          setEditableContent(content)
          setFileTitle(
            filePath
              .split('\\')
              .pop()
              ?.replace(/\.[^/.]+$/, '') || ''
          ) // Extract file name from path
        } catch (error) {
          console.error('Error reading selected file:', error)
          setInitialFileContent('')
          setEditableContent('')
        }
      }
    }

    loadFile()
  }, [filePath])

  const handleSave = async (): Promise<void> => {
    if (!filePath) {
      setSaveError('No file selected')
      return
    }
    setSaving(true)
    setSaveError(null)
    try {
      await window.api.saveTextFile(filePath, editableContent)
      console.log('File saved successfully')
      setInitialFileContent(editableContent)
      setIsEditing(false)
    } catch (err: unknown) {
      console.error('Error saving file:', err)
      setSaveError(`Failed to save file. Error: ${err}`)
    } finally {
      setSaving(false)
    }
  }

  const handleEditableContentChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setEditableContent(event.target.value)
  }

  const handleDiscardChanges = (): void => {
    setEditableContent(initialFileContent)
    setIsEditing(false)
    console.log('Changes Discarded')
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2>DocumentViewer Component</h2>
      {/* REMOVE THIS BUTTON */}
      {/* <button onClick={handleFileSelect}>Open File</button> */}

      {fileTitle && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Selected File Title:</h3>
          <p>{fileTitle}</p>
        </div>
      )}

      {loading && <p>Loading file content...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {initialFileContent && (
        <div style={{ marginTop: '1rem' }}>
          <h3>File Content:</h3>
          <textarea
            value={editableContent}
            onChange={handleEditableContentChange}
            style={{ width: '100%', minHeight: '200px' }}
          />
          <div style={{ marginTop: '1rem' }}>
            <button onClick={handleSave} disabled={saving || !isEditing}>
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleDiscardChanges} disabled={!isEditing}>
              Discard Changes
            </button>
          </div>
          {saveError && <p style={{ color: 'red' }}>{saveError}</p>}
        </div>
      )}
    </div>
  )
}

export default DocumentViewer
