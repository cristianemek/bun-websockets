import { use } from "react";
import { WebSocketContext } from "../context/WebSocketContext";

export const useSocketTicket = () => {
  const { send, subscribeToMessages } = use(WebSocketContext);

  const createTicket = (isPreferential: boolean) => {
    send({
      type: "CREATE_TICKET",
      payload: {
        isPreferential,
      },
    });
  };

  const getQueueState = () => {
    send({
      type: "GET_STATE",
    });
  };

  const requestNextTicket = (
    deskNumber: number,
    forceNormalTicket: boolean,
  ) => {
    send({
      type: "REQUEST_NEXT_TICKET",
      payload: {
        deskNumber,
        forceNormalTicket,
      },
    });
  };

  return {

    // Methods
    createTicket,
    getQueueState,
    requestNextTicket,

    // Subscriptions
    subscribeToMessages,
  };
};
