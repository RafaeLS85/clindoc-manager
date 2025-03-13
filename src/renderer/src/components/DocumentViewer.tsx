import React, { useEffect, useState } from 'react'

interface DocumentViewerProps {
  filePath: string | null
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ filePath }) => {
  const [fileTitle, setFileTitle] = useState<string>('')
  const [initialFileContent, setInitialFileContent] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false) // Use this for loading state
  const [error, setError] = useState<string>('') // Use this for errors
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
        setLoading(true) // Start loading
        setError('') // Clear any previous errors
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
        } catch (err: unknown) {
          console.error('Error reading selected file:', err)
          setError(`Error reading file: ${err}`) // Set the error message
          setInitialFileContent('')
          setEditableContent('')
        } finally {
          setLoading(false) // Stop loading, whether successful or not
        }
      } else {
        // If no file path is selected, clear the content and title.
        setInitialFileContent('')
        setEditableContent('')
        setFileTitle('')
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

      {/* Show loading if loading */}
      {loading && <p>Loading file content...</p>}

      {/* Show error if there is an error */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fileTitle && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Selected File Title:</h3>
          <p>{fileTitle}</p>
        </div>
      )}

      {initialFileContent && !loading && !error && (
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
