import { useState, useEffect } from 'react'

interface Versions {
  chrome: string
  node: string
  electron: string
}

function Versions(): JSX.Element {
  const [versions, setVersions] = useState<Versions | null>(null)

  useEffect(() => {
    window.api.getVersions().then((versions) => {
      setVersions(versions)
    })
  }, [])

  if (!versions) {
    return <div>Loading versions...</div>
  }

  return (
    <ul className="versions">
      <li className="electron-version">Electron v{versions.electron}</li>
      <li className="chrome-version">Chromium v{versions.chrome}</li>
      <li className="node-version">Node v{versions.node}</li>
    </ul>
  )
}

export default Versions
