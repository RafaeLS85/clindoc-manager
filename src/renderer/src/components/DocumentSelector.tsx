import React, { useEffect, useState } from 'react'

const DocumentViewer: React.FC = () => {
  const [fileTitle, setFileTitle] = useState<string>('')
  const [docHtml, setDocHtml] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    console.log('docHtml updated:', { docHtml })
  }, [docHtml])

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('')
    setDocHtml('')

    // Selecciona el primer archivo (si existe)
    const file = event.target.files && event.target.files[0]
    if (file && (file as any).path) {
      // Extraemos la ruta y el nombre (sin extensión)
      const filePath: string = (file as any).path
      const title = file.name.replace(/\.[^/.]+$/, '')
      setFileTitle(title)

      console.log('File path:', filePath)
      console.log('File title:', title)

      try {
        setLoading(true)
        // Llama a la API readDocx, la cual retorna una promesa con el contenido HTML del archivo DOCX
        const content: string = await window.api.readDocx(filePath)
        setDocHtml(content)
      } catch (err: any) {
        console.error('Error reading DOCX:', err)
        setError('Failed to read DOCX file.')
      } finally {
        setLoading(false)
      }
    }
  }

  console.log({ docHtml })

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Select a Document</h2>
      <input type="file" accept=".docx" onChange={handleFileChange} />

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

export default DocumentViewer
