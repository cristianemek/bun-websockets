import {
  createContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type ConnectingStatus = "connecting" | "connected" | "disconnected" | "error";

export interface SocketMessage {
  type: SendType;
  payload: unknown;
}

export interface SocketResponse {
  type: ResponseType;
  payload: unknown;
}

interface WebSocketContextState {
  status: ConnectingStatus;
  lastMessage: SocketResponse | null;
  send: (message: SocketMessage) => void;
}

export type SendType =
  | "GET_PARTIES"
  | "ADD_PARTY"
  | "UPDATE_PARTY"
  | "DELETE_PARTY"
  | "INCREMENT_VOTES"
  | "DECREMENT_VOTES";

type ResponseType =
  | "PARTIES_LIST"
  | "PARTY_ADDED"
  | "PARTY_UPDATED"
  | "PARTY_DELETED"
  | "VOTES_UPDATED"
  | "ERROR";

// eslint-disable-next-line react-refresh/only-export-components
export const WebSocketContext = createContext({} as WebSocketContextState);

interface Props {
  children: ReactNode;
  url: string;
}

export const WebSocketProvider = ({ children, url }: Props) => {
  const [status, setStatus] = useState<ConnectingStatus>("connecting");
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const [lastMessage, setLastMessage] = useState<SocketResponse | null>(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(url);

    ws.addEventListener("open", () => {
      setSocket(ws);
      setStatus("connected");
    });

    ws.addEventListener("close", () => {
      setSocket(null);
      setStatus("disconnected");
    });

    ws.addEventListener("error", (event) => {
      console.log({ customError: event });
      setStatus("error");
    });

    ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      setLastMessage(message);
      console.log({ message });
    });

    return ws;
  }, [url]);

  useEffect(() => {
    const ws = connect();

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [connect]);

  //funcion de conexion
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (status === "disconnected") {
      interval = setInterval(() => {
        console.log("reconecting");
        connect();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, connect]);

  const send = (message: SocketMessage) => {
    if (!socket) throw new Error("Socket not connected");
    if (status !== "connected")
      throw new Error("Socket not connected (status)");

    const jsonMessage = JSON.stringify(message);
    socket.send(jsonMessage);
  };

  return (
    <WebSocketContext
      value={{ status: status, send: send, lastMessage: lastMessage }}
    >
      {children}
    </WebSocketContext>
  );
};
