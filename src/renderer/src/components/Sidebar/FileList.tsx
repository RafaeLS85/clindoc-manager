import { FaFileWord } from 'react-icons/fa'
import { FiFileText } from 'react-icons/fi'
import { FaFileExcel } from 'react-icons/fa'
import { CiFileOn } from 'react-icons/ci'
import { FaRegFilePdf } from 'react-icons/fa6'

interface FileListProps {
  handleFileClick: (fileName: string) => void

  filteredFiles: string[]
}

const FileList: React.FC<FileListProps> = ({ filteredFiles, handleFileClick }: FileListProps) => {
  const listStyles: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    overflowY: 'auto',
    flexGrow: 1
  }

  const getIconForFile = (fileName?: string): JSX.Element | null => {
    const extension = fileName?.split('.').pop()
    // console.log('extension:', extension) // e.g. 'docx'

    switch (extension) {
      case 'docx':
        return <FaFileWord />
      case 'odt':
        return <FaFileWord />
      case 'txt':
        return <FiFileText />
      case 'xlsx':
        return <FaFileExcel />
      case 'pdf':
        return <FaRegFilePdf />
      default:
        return <CiFileOn />
    }
  }

  return (
    <ul style={listStyles}>
      {filteredFiles.map((file) => (
        <li key={file} onClick={() => handleFileClick(file)} style={{ cursor: 'pointer' }}>
          {getIconForFile(file)} {file}
        </li>
      ))}
    </ul>
  )
}

export default FileList
