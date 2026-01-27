import "./App.css";
import { WebSocketProvider } from "./context/WebSocketContext";
import { HomePage } from "./pages/HomePage";

function PoliticalApp() {
  return (
    <WebSocketProvider url="ws://localhost:3200">
      <HomePage />
    </WebSocketProvider>
  );
}

export default PoliticalApp;
