import { useEffect } from 'react'

function DocxReader(): JSX.Element {
  useEffect(() => {
    const read = async (): Promise<void> => {
      try {
        const filePath = 'C:\\Users\\rafae\\Downloads\\PACIENTES\\test-nodejs.docx'
        const result = await window.api.readDocx(filePath)
        console.log('readed file:', result.value)
      } catch (error) {
        console.error('Failed to read docx file', error)
      }
    }
    read()
  }, [])

  return <div className="App">DocxReader</div>
}

export default DocxReader
