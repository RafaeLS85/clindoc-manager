// import { FaFileWord } from 'react-icons/fa'
// import { FiFileText } from 'react-icons/fi'
// import { FaFileExcel } from 'react-icons/fa'
// import { CiFileOn } from 'react-icons/ci'
// import { FaRegFilePdf } from 'react-icons/fa6'

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

  return (
    <ul style={listStyles}>
      {filteredFiles.map((file) => (
        <li key={file} onClick={() => handleFileClick(file)} style={{ cursor: 'pointer' }}>
          {file}
        </li>
      ))}
    </ul>
  )
}

export default FileList
