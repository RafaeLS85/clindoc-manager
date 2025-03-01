import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import DocumentViewer from './components/DocumentViewer'

function App(): JSX.Element {
  const ipcHandle = (): void => {
    console.log('ping')
    window.electron.ipcRenderer.send('ping')
  }

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />

      <div className="action">
        <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
          Send IPC
        </a>
      </div>

      <DocumentViewer />

      <Versions></Versions>
    </>
  )
}

export default App
