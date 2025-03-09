import React, { useEffect, useState } from 'react'
import { FileFilter } from 'src/types/api'

const DocumentSelector: React.FC = () => {
  const [fileTitle, setFileTitle] = useState<string>('')
  const [docHtml, setDocHtml] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const docxFilter: FileFilter[] = [{ name: 'Word Files', extensions: ['docx', 'doc'] }]

  useEffect(() => {
    console.log('docHtml updated:', { docHtml })
  }, [docHtml])

  const handleFileSelect = async (): Promise<void> => {
    setError('')
    setDocHtml('')
    setLoading(true)

    try {
      const filePath = await window.api.openFileDialog(docxFilter)

      if (filePath) {
        const file = {
          path: filePath,
          name: filePath.split('\\').pop() as string
        }

        const title = file.name.replace(/\.[^/.]+$/, '')
        setFileTitle(title)

        console.log('File path:', filePath)
        console.log('File title:', title)

        // Llama a la API readDocx, la cual retorna una promesa con el contenido HTML del archivo DOCX
        const content: string = await window.api.readDocx(filePath)
        setDocHtml(content)
      } else {
        console.log('File selection canceled.')
        setLoading(false)
      }
    } catch (err: unknown) {
      console.error('Error reading DOCX:', err)
      setError('Failed to read DOCX file.')
    } finally {
      if (!error) setLoading(false)
    }
  }

  console.log({ docHtml })

  return (
    <div style={{ padding: '1rem' }}>
      <h2>DocumentSelector Component</h2>
      {/*<input type="file" accept=".docx" onChange={handleFileChange} />*/}
      <button onClick={handleFileSelect}>Open File</button>

      {fileTitle && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Selected File Title:</h3>
          <p>{fileTitle}</p>
        </div>
      )}

      {loading && <p>Loading file content...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {docHtml && (
        <div style={{ marginTop: '1rem' }}>
          <h3>File Content:</h3>

          {/* La propiedad dangerouslySetInnerHTML se usa aquí para insertar el HTML.
              Asegúrate que el HTML sea seguro, por ejemplo, si Mammoth.js ya lo sanitiza */}
          <div dangerouslySetInnerHTML={{ __html: docHtml }} />
        </div>
      )}
    </div>
  )
}

export default DocumentSelector
