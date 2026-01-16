import type { WebSocketMessage, WebSocketResponse } from "../types";

const createErrorResponse = (error: string): WebSocketResponse => {
  return {
    type: "ERROR",
    payload: { error: error },
  };
};

//handlers especificos
const handleAddParty = (payload: unknown): WebSocketResponse => {
  return {
    type: "PARTY_ADDED",
    payload: {
      name: "New Party",
    },
  };
};

const handleGetParties = (): WebSocketResponse => {
  return {
    type: "PARTIES_LIST",
    payload: null,
  };
}

const handleUpdateParty = (payload: unknown): WebSocketResponse => {
  return {
    type: "PARTY_UPDATED",
    //todo
    payload: {},
  };
}

const handleDeleteParty = (payload: unknown): WebSocketResponse => {
  return {
    type: "PARTY_DELETED",
    //todo
    payload: {},
  };
}

const handleIncrementVotes = (payload: unknown): WebSocketResponse => {
  return {
    type: "VOTES_UPDATED",
    //todo
    payload: {},
  };
}

const handleDecrementVotes = (payload: unknown): WebSocketResponse => {
  return {
    type: "VOTES_UPDATED",
    //todo
    payload: {},
  };
}

//! General Handler o controlador general
export const handleMessage = (message: string): WebSocketResponse => {
  try {
    const jsonData: WebSocketMessage = JSON.parse(message);
    //TODO: validar objeto json

    const { type, payload } = jsonData;

    switch (type) {
      case "ADD_PARTY":
        return handleAddParty(payload);

      case "GET_PARTIES":
        return handleGetParties();

      case "UPDATE_PARTY":
        return handleUpdateParty(payload);

      case "DELETE_PARTY":
        return handleDeleteParty(payload);

      case "INCREMENT_VOTES":
        return handleIncrementVotes(payload);

      case "DECREMENT_VOTES":
        return handleDecrementVotes(payload);
        
      default:
        return createErrorResponse(`Unknown message type: ${type}`);
    }
  } catch (error) {
    return createErrorResponse(`Validation error`);
  }
};
