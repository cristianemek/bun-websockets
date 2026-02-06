import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Client, LatLng } from "../types";
import Cookies from "js-cookie";

type ConnectionStatus =
  | "offline"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

// Tipados específicos
export type SocketMessage =
  | {
      type: "CLIENT_REGISTER";
      payload: { name: string; color: string; coords: LatLng };
    }
  | {
      type: "CLIENT_MOVE";
      payload: { clientId: string; coords: LatLng };
    }
  | {
      type: "GET_CLIENTS";
      payload: unknown;
    };

export type SocketResponse =
  | { type: "ERROR"; payload: { message: string } }
  | { type: "WELCOME"; payload: Client }
  | { type: "CLIENT_STATE"; payload: Client[] }
  | { type: "CLIENT_JOINED"; payload: Client }
  | { type: "CLIENT_MOVED"; payload: Client }
  | { type: "CLIENT_LEFT"; payload: { clientId: string } };

export type SocketMessageListener = (message: SocketResponse) => void;

interface WebSocketContextState {
  status: ConnectionStatus;
  socketId: string | null;

  //methods
  connectToServer: (name: string, color: string, latLng: LatLng) => void;
  disconnect: () => void;
  send: (message: SocketMessage) => void;
  subscribeToMessages: (listener: SocketMessageListener) => () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const WebSocketContext = createContext({} as WebSocketContextState);

const messageListenerRef = new Set<SocketMessageListener>();
let connecting = false;

interface Props {
  children: ReactNode;
  url: string;
}

export const WebSocketProvider = ({ children, url }: Props) => {
  const [status, setStatus] = useState<ConnectionStatus>("offline");
  const [socketId, setSocketId] = useState<string | null>(null);
  const shouldReconnectRef = useRef(true);

  const socket = useRef<WebSocket | null>(null);

  const disconnect = () => {
    socket.current?.close();
    socket.current = null;
    shouldReconnectRef.current = false;
    setStatus("offline");
  };

  const connect = useCallback(() => {
    if (connecting) return null;
    connecting = true;

    const ws = new WebSocket(url);
    shouldReconnectRef.current = true;

    ws.addEventListener("open", () => {
      connecting = false;
      socket.current = ws;
      setStatus("connected");
    });

    ws.addEventListener("close", () => {
      socket.current = null;
      setStatus("disconnected");
    });

    ws.addEventListener("error", (event) => {
      connecting = false;
      setStatus("error");
      console.log({ customError: event });
    });

    ws.addEventListener("message", (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === "WELCOME") {
          setSocketId(message.payload.id);
        }

        messageListenerRef.forEach((listener) => listener(message));
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    return ws;
  }, [url]);

  const connectToServer = (name: string, color: string, coords: LatLng) => {
    if (status === "connected" || status === "connecting") return;

    Cookies.set("name", name);
    Cookies.set("color", color);
    Cookies.set("coords", JSON.stringify(coords));
    connect();
  };

  const subscribeToMessages = (listener: SocketMessageListener) => {
    messageListenerRef.add(listener);

    return () => {
      messageListenerRef.delete(listener);
    };
  };

  useEffect(() => {
    const ws = connect();

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [connect]);

  // Función básica de re-conexión
  useEffect(() => {

    if (!shouldReconnectRef.current) return;

    let interval: ReturnType<typeof setInterval>;
    if (status === "disconnected") {
      interval = setInterval(() => {
        console.log("Reconnecting every 1 second...");
        connect();
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [status, connect]);

  const send = (message: SocketMessage) => {
    if (!socket.current) throw new Error("Socket not connected");
    const jsonMessage = JSON.stringify(message);
    socket.current.send(jsonMessage);
  };

  return (
    <WebSocketContext
      value={{
        status: status,
        send: send,
        socketId: socketId,
        connectToServer: connectToServer,
        disconnect: disconnect,
        subscribeToMessages: subscribeToMessages,
      }}
    >
      {children}
    </WebSocketContext>
  );
};
