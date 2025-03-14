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
        setLoading(true)
        setError('')
        try {
          const content = await window.api.readTextFile(filePath)
          setInitialFileContent(content)
          setEditableContent(content)
          setFileTitle(
            filePath
              .split('\\')
              .pop()
              ?.replace(/\.[^/.]+$/, '') || ''
          )
        } catch (err: unknown) {
          console.error('Error reading selected file:', err)
          setError(`Error reading file: ${err}`)
          setInitialFileContent('')
          setEditableContent('')
        } finally {
          setLoading(false)
        }
      } else {
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

  const textAreaStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '200px',
    fontSize: '1rem',
    height: '100%',
    color: 'rgba(255, 255, 245, 0.86)',
    background: '#1b1b1f'
  }

  return (
    <div
      style={{
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {loading && <p>Loading file content...</p>}

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fileTitle && (
        <div style={{ marginTop: '1rem' }}>
          <p>{fileTitle}</p>
        </div>
      )}

      {initialFileContent && !loading && !error && (
        <div
          style={{
            marginTop: '1rem'
          }}
        >
          <div>
            <textarea
              value={editableContent}
              onChange={handleEditableContentChange}
              style={textAreaStyle}
            />
          </div>
          <div>
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
        </div>
      )}
    </div>
  )
}

export default DocumentViewer
