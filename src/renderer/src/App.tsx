import Versions from './components/Versions'
import DateViewer from './components/DateViewer'
import DocumentSelector from './components/DocumentSelector'
import DocumentViewer from './components/DocumentViewer'

function App(): JSX.Element {
  return (
    <div>
      <h1>¡Hola, Mundo!</h1>
      <Versions />
      <DateViewer />
      <DocumentSelector />
      <DocumentViewer />
    </div>
  )
}

export default App
