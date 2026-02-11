import { messageSchema } from "../schemas/websocket-message.schema";
import { ticketQueueService } from "../services/ticket-queue.service";
import type { ClientMessage, HandleResult, ServerMessage } from "../types";

export const createErrorMessage = (error: string): ServerMessage => {
  return {
    type: "ERROR",
    payload: { error: error },
  };
};

export const createEmptyResponse = (): HandleResult => {
  return {
    personal: [],
    broadcast: [],
  };
};

export const createQueueStateMessage = (): ServerMessage => {
  return {
    type: "QUEUE_STATE",
    payload: {
      state: ticketQueueService.getState(),
    },
  };
};

export const createResetQueueMessage = (): ServerMessage => {
  ticketQueueService.reset();

  return {
    type: "QUEUE_STATE",
    payload: {
      state: ticketQueueService.getState(),
    },
  };
};

export const createNewTicketMessage = (
  isPreferential: boolean,
): ServerMessage => {
  const prefix = isPreferential ? "P" : "A";
  const newTicket = ticketQueueService.createTicket(prefix);

  return {
    type: "TICKET_CREATED",
    payload: {
      ticket: newTicket,
    },
  };
};

export const createNextTicketAssigned = (deskNumber: number, forceNormalTicket: boolean): ServerMessage => {

  const nextTicket = ticketQueueService.assignNextTicket(
    deskNumber,
    forceNormalTicket,
  );

  if (!nextTicket) {
    return {
      type: "QUEUE_EMPTY",
    }
  }

  return {
    type: "NEXT_TICKET_ASSIGNED",
    payload: {
      ticket: nextTicket,
    },
  }

}

//! Handlers específicos

//! General Handler o controlador general
export const handleMessage = (message: string): HandleResult => {
  try {
    const jsonData: ClientMessage = JSON.parse(message);
    const parsedResult = messageSchema.safeParse(jsonData);

    const response = createEmptyResponse();

    if (!parsedResult.success) {
      console.log(parsedResult.error);
      const errorMessage = parsedResult.error.issues
        .map((issue) => issue.message)
        .join(", ");

      response.personal.push(
        createErrorMessage(`Validation error: ${errorMessage}`),
      );

      return response;
    }

    const parsed= parsedResult.data;

    switch (parsed.type) {
      case "CREATE_TICKET":
        const ticketMessage = createNewTicketMessage(parsed.payload.isPreferential);
        response.personal.push(ticketMessage);
        response.personal.push(createQueueStateMessage());
        response.broadcast.push(createQueueStateMessage());
        return response;

      case "GET_STATE":
        const stateMessage = createQueueStateMessage();
        response.personal.push(stateMessage);
        return response;

      case "REQUEST_NEXT_TICKET":
        const {deskNumber, forceNormalTicket} = parsed.payload;
        const nextTicketMessage = createNextTicketAssigned(deskNumber, forceNormalTicket);
        response.personal.push(nextTicketMessage);
        response.personal.push(createQueueStateMessage());
        response.broadcast.push(createQueueStateMessage());


        return response;

      case "RESET_QUEUE":
        const resetMessage = createResetQueueMessage();
        response.personal.push(resetMessage);
        response.broadcast.push(resetMessage);
        return response;
      default:
        return {
          personal: [createErrorMessage(`Unknown message: ${parsed}`)],
          broadcast: [],
        };
    }
  } catch (error) {
    return {
      personal: [createErrorMessage(`Validation error`)],
      broadcast: [],
    };
  }
};
