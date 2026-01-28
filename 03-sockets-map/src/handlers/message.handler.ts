import {
  messageSchema,
  type ClientRegisterPayload,
  type MessageParsed,
} from '../schemas/websocket-message.schema';
import { myService } from '../services/my-service.service';
import type { OutgoingWsMessage } from '../types';

interface HandlerResult {
  personal: OutgoingWsMessage[];
  broadcast: OutgoingWsMessage[];
}


const createErrorResponse = (error: string): OutgoingWsMessage => {
  return {
    type: 'ERROR',
    payload: { error: error },
  };
};

//! Handlers específicos
export const handleGetClients = (): HandlerResult => {
  return {
    personal: [
      {
        type: 'CLIENTS_STATE',
        payload: [],
      }
    ],
    broadcast: [],
  }
}
export const handleClientRegister = (clientId: string, payload:ClientRegisterPayload): HandlerResult => {
  return {
    personal: [],
    broadcast: [
      {
        type: 'CLIENT_JOINED',
        payload: {
          clientId,
          name: payload.name,
          color: payload.color || 'gray',
          coords: payload.coords,
          updatedAt: Date.now(),
        }
      }
    ],
  }
}
export const handleClientMoved = (clientId, payload): HandlerResult => {
  return {
    personal: [],
    broadcast: [],
  }
}

//! General Handler o controlador general
export const handleMessage = (clientId: string, rawMessage: string): HandlerResult => {
  try {
    const jsonData: unknown = JSON.parse(rawMessage);
    const parsedResult = messageSchema.safeParse(jsonData);

    if (!parsedResult.success) {
      console.log(parsedResult.error);
      const errorMessage = parsedResult.error.issues
        .map((issue) => issue.message)
        .join(', ');

      return {
        personal: [createErrorResponse(`Validation error: ${errorMessage}`)],
        broadcast: [],
      };
    }

    const { type, payload } = parsedResult.data;

    switch (type) {
      case 'GET_CLIENTS':
        return handleGetClients();

      case 'CLIENT_REGISTER':
        return handleClientRegister(clientId,payload);

      case 'CLIENT_MOVE':
        return handleClientMoved(clientId,payload);

      default:
        return {
          personal: [createErrorResponse(`Unknown message type: ${type}`)],
          broadcast: [],
        };
    }
  } catch (error) {
    console.log({error})
    return {
        personal: [createErrorResponse(`Unexpected error: ${error}`)],
        broadcast: [],
      };
  }
};
