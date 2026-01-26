import { messageSchema, type MessafeParsed, type MessafePayload } from "../schemas/websocket-message.schema";
import { partyService } from "../services/party.service";
import type { PoliticalParty, WebSocketMessage, WebSocketResponse } from "../types";

const createErrorResponse = (error: string): WebSocketResponse => {
  return {
    type: "ERROR",
    payload: { error: error },
  };
};

//handlers especificos
const handleAddParty = (payload: MessafeParsed['payload']): WebSocketResponse => {

  if (!payload?.name || !payload.color || !payload.borderColor){
    return createErrorResponse('Name, color and borderColor are required')
  }

  const newParty = partyService.add(payload.name, payload.color, payload.borderColor)

  return {
    type: "PARTY_ADDED",
    payload: newParty
  }
};

export const handleGetParties = (): WebSocketResponse => {
  return {
    type: "PARTIES_LIST",
    payload: partyService.getAll(),
  };
}

const handleUpdateParty = (payload: MessafeParsed['payload']): WebSocketResponse => {

  if (!payload?.id){
    return createErrorResponse('Party ID is required');
  }

  const updatedParty = partyService.update(payload.id,{
    name:payload.name,
    color:payload.color,
    borderColor:payload.borderColor,
    votes:payload.votes,
  })

  if (!updatedParty){
    createErrorResponse(`Party with id: ${payload.id} not found`)
  }

  return {
    type: "PARTY_UPDATED",
    payload: updatedParty,
  };
}

const handleDeleteParty = (payload: MessafeParsed['payload']): WebSocketResponse => {
  if (!payload?.id){
   return createErrorResponse(`Party with id: ${payload?.id} not found`)
  }

  const deleted = partyService.delete(payload.id)
  if (!deleted){
    createErrorResponse(`Party with id: ${payload.id} not found or can't be deleted`)
  }
  return {
    type: "PARTY_DELETED",
    payload: {
      id: payload.id
    },
  };
}

const handleIncrementVotes = (payload: MessafeParsed['payload']): WebSocketResponse => {
  if (!payload?.id){
   return createErrorResponse(`Party with id: ${payload?.id} not found`)
  }

  const updatedVotes = partyService.incrementVotes(payload.id)
  if (!updatedVotes){
    createErrorResponse(`Party with id: ${payload.id} not found or can't increment votes`)
  }


  return {
    type: "VOTES_UPDATED",
    payload: updatedVotes,
  };
}

const handleDecrementVotes = (payload: MessafeParsed['payload']): WebSocketResponse => {
  if (!payload?.id){
   return createErrorResponse(`Party with id: ${payload?.id} not found`)
  }

  const updatedVotes = partyService.decrementVotes(payload.id)
  if (!updatedVotes){
    createErrorResponse(`Party with id: ${payload.id} not found or can't decrement votes`)
  }

  return {
    type: "VOTES_UPDATED",
    payload: updatedVotes,
  };
}

//! General Handler o controlador general
export const handleMessage = (message: string): WebSocketResponse => {
  try {
    const jsonData: WebSocketMessage = JSON.parse(message);
    const parsedResult = messageSchema.safeParse(jsonData)

    if (!parsedResult.success){
      const errorMessage = parsedResult.error.issues
      .map(issue => issue.message)
      .join(', ')

      return createErrorResponse(`Validation error ${errorMessage}`)
    }

    const { type, payload } = parsedResult.data;

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
