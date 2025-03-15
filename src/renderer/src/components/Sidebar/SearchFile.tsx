interface SearchFileProps {
  searchTerm: string
  handleSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  filteredFiles: string[]
  files: string[]
}

const SearchFile = ({
  searchTerm,
  handleSearchChange,
  filteredFiles,
  files
}: SearchFileProps): JSX.Element => {
  return (
    <>
      <input
        type="text"
        placeholder="Buscar"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '10px', width: '100%' }}
      />

      {searchTerm && filteredFiles.length < files.length && (
        <p style={{ fontSize: '0.8rem', color: 'gray' }}>
          {filteredFiles.length} of {files.length} files are shown
        </p>
      )}
    </>
  )
}

export default SearchFile
