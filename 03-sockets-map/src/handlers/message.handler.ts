import {
  messageSchema,
  type ClientMovePayload,
  type ClientRegisterPayload,
} from '../schemas/websocket-message.schema';
import { clientsService } from '../services/clients.service';
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
        payload: clientsService.getAllClients(),
      }
    ],
    broadcast: [],
  }
}
export const handleClientRegister = (clientId: string, payload:ClientRegisterPayload): HandlerResult => {
  const newClient = clientsService.registerClient(payload);

  if ('error' in newClient) {
    return {
      personal: [createErrorResponse(newClient.error)],
      broadcast: [],
    }
  }


  return {
    personal: [
      {
        type: 'WELCOME',
        payload: newClient,
      },
      {
        type: 'CLIENTS_STATE',
        payload: clientsService.getAllClients().filter(c => c.clientId !== clientId),
      }
    ],
    broadcast: [
      {
        type: 'CLIENT_JOINED',
        payload: newClient,
      }
    ],
  }
}
export const handleClientMoved = (clientId: string, payload: ClientMovePayload): HandlerResult => {
  const movedClient = clientsService.ClientMoved(clientId, payload);

  if ('error' in movedClient) {
    return {
      personal: [createErrorResponse(movedClient.error)],
      broadcast: [],
    }
  }

  return {
    personal: [
      {
        type: 'CLIENT_MOVED',
        payload: {
          clientId: clientId,
          coords: movedClient.coords,
          updatedAt: movedClient.updatedAt,
        },
      }
    ],
    broadcast: [
      {
        type: 'CLIENT_MOVED',
        payload: movedClient,
      }
    ],
  }
}

export const handleClientLeft = (clientId:string): HandlerResult => {
  const clientWasRemoved = clientsService.removeClient(clientId);

  if (clientWasRemoved){
  return {
    personal: [],
    broadcast: [
      {
        type: 'CLIENT_LEFT',
        payload: { clientId }
      }
    ],
  }
}
  return {
    personal:[],
    broadcast:[],
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
      
      case 'CLIENT_LEFT':
        return handleClientLeft(clientId);

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
