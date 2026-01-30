import { ConnectForm } from './components/ConnectForm'
import { MapPage } from './pages/MapPage'

function SocketMapApp() {

  return (
    <>
      <ConnectForm onSubmit={(name, color) => {
        console.log('Connecting user:', { name, color })
      }} />
      <MapPage />
    </>
  )
}

export default SocketMapApp
