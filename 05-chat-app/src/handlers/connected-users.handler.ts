import { userService } from "../services/user.service";
import type { ServerMessage } from "../types";
import type { Sender } from "../types/chat-message.types";

const serverMessageResponse = (users: Sender[]): ServerMessage => ({
  type: "SEND_CONNECTED_USERS_RESPONSE",
  payload: {
    users,
  },
});

export const handleAddConnectedUser = (user: Sender): ServerMessage => {
  userService.addConnectedUser(user);


  //! aqui deberia de enviar solo el evento de usuario conectado/desconectado, y no recalcular toda la lista
  const users = userService.getConnectedUsers();

  return serverMessageResponse(users);
};

export const handleRemoveConnectedUser = (userId: string): ServerMessage => {
  userService.removeConnectedUser(userId);
  const users = userService.getConnectedUsers();

  return serverMessageResponse(users);
};
