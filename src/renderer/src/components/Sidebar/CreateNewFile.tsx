import { IoMdClose } from 'react-icons/io'
import { MdAddBox } from 'react-icons/md'

interface CreateNewFileProps {
  createNewFile: boolean
  newFileName: string
  creating: boolean
  createError: string | null
  setCreateNewFile: React.Dispatch<React.SetStateAction<boolean>>
  handleNewFileNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleCreateFile: () => void
}

const CreateNewFile = ({
  createNewFile,
  newFileName,
  creating,
  createError,
  setCreateNewFile,
  handleNewFileNameChange,
  handleCreateFile
}: CreateNewFileProps): JSX.Element => {
  const addButtonStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    gap: '5px',
    padding: '5px'
  }

  return (
    <div style={{ border: '1px solid #ccc' }}>
      <div style={addButtonStyles} onClick={() => setCreateNewFile(!createNewFile)}>
        {createNewFile ? <IoMdClose /> : <MdAddBox />}

        <p>{!createNewFile ? 'Agregar historia' : 'Cerrar'}</p>
      </div>

      <div>
        {createNewFile && (
          <>
            <input
              type="text"
              placeholder="Nombre del nuevo archivo"
              value={newFileName}
              onChange={handleNewFileNameChange}
              style={{ marginBottom: '10px', width: '100%' }}
            />
            <button onClick={handleCreateFile} disabled={creating || !newFileName}>
              {creating ? 'Espere...' : 'Crear archivo'}
            </button>
          </>
        )}

        {createError && <p style={{ color: 'red' }}>{createError}</p>}
      </div>
    </div>
  )
}

export default CreateNewFile
