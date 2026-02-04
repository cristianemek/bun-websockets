import { ConnectForm } from './components/ConnectForm'
import { WebSocketProvider } from './context/WebSocketContext'
import { MapPage } from './pages/MapPage'

function SocketMapApp() {

  return (
    <WebSocketProvider url="ws://localhost:3200">
      <ConnectForm onSubmit={(name, color) => {
        console.log('Connecting user:', { name, color })
      }} />
      <MapPage />
    </WebSocketProvider>
  )
}

export default SocketMapApp
