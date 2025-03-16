import FileList from './FileList'
import SearchFile from './SearchFile'
import CreateNewFile from './CreateNewFile'
import { useSideBar } from './useSideBar'

interface SidebarProps {
  directoryPath: string | null
  onFileSelect: (filePath: string) => void
}

const Sidebar: React.FC<SidebarProps> = ({ directoryPath, onFileSelect }: SidebarProps) => {
  const {
    createError,
    createNewFile,
    creating,
    files,
    filteredFiles,
    newFileName,
    searchTerm,
    getFolderName,
    handleCreateFile,
    handleFileClick,
    handleNewFileNameChange,
    handleSearchChange,
    setCreateNewFile
  } = useSideBar({ directoryPath, onFileSelect })

  const mainContainer: React.CSSProperties = {
    width: '250px',
    borderRight: '1px solid #ccc',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  }

  return (
    <div style={mainContainer}>
      {/* {JSON.stringify(files)} */}
      {/* {JSON.stringify(filteredFiles)} */}

      <h3>{getFolderName(directoryPath)}</h3>
      <CreateNewFile
        createError={createError}
        createNewFile={createNewFile}
        creating={creating}
        newFileName={newFileName}
        handleCreateFile={handleCreateFile}
        handleNewFileNameChange={handleNewFileNameChange}
        setCreateNewFile={setCreateNewFile}
      />
      <SearchFile
        files={files}
        filteredFiles={filteredFiles}
        handleSearchChange={handleSearchChange}
        searchTerm={searchTerm}
      />
      <FileList filteredFiles={filteredFiles} handleFileClick={handleFileClick} />
    </div>
  )
}

export default Sidebar
