import Versions from './components/Versions'
// import DocumentViewer from './components/DocumentViewer'
import DocumentSelector from './components/DocumentSelector'

function App(): JSX.Element {
  return (
    <>
      <DocumentSelector />

      <Versions></Versions>
    </>
  )
}

export default App
