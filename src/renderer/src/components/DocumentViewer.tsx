// Ejemplo en un componente React
import React from 'react'

const DocumentViewer: React.FC = () => {
  const handleOpenDocx = async (): Promise<void> => {
    try {
      // Al llamar a window.api.readDocx, TypeScript reconoce la firma y el retorno.
      const htmlContent = await window.api.readDocx('ruta/al/documento.docx')
      console.log(htmlContent)
      // Puedes ahora mostrar htmlContent en tu componente, por ejemplo, en un editor o div.
    } catch (error) {
      console.error('Error al procesar el archivo DOCX:', error)
    }
  }

  return (
    <div>
      <button onClick={handleOpenDocx}>Abrir documento DOCX</button>
    </div>
  )
}

export default DocumentViewer
