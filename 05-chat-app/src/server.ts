import { SERVER_CONFIG } from "./config/server-config";

import indexHtml from "../public/index.html";
import { generateUuid } from "./utils/generate-uuid";
import type { WebSocketData } from "./types";
import { handleMessage } from "./handlers/message.handler";
import { handleApiRequest } from "./handlers-rest";
import { validateJwtToken } from "./utils/jwt-validation";
import { email } from "zod";
import { userService } from "./services/user.service";
import { handleGetGroupMessages } from "./handlers/group-message.handlers";
import {
  handleAddConnectedUser,
  handleRemoveConnectedUser,
} from "./handlers/connected-users.handler";

export const createServer = () => {
  const server = Bun.serve<WebSocketData>({
    port: SERVER_CONFIG.port,

    routes: {
      "/": indexHtml,
    },

    async fetch(req, server) {
      const response = await handleApiRequest(req);

      if (response) {
        return response;
      }

      //! Identificar clientes/usuarios

      const cookies = new Bun.CookieMap(req.headers.get("cookie") || "");
      const jwt = cookies.get("X-Token");

      if (!jwt) {
        return new Response("Unauthorized", { status: 401 });
      }

      const { userId } = await validateJwtToken(jwt);

      if (!userId) {
        return new Response("Unauthorized", { status: 401 });
      }

      const user = await userService.getSenderById(userId);

      if (!user) {
        return new Response("Unauthorized", { status: 401 });
      }

      //todo validar usuario en base de datos, verificar que exista, que el token no esté revocado, etc.

      //* Identificar nuestros clientes
      const clientId = generateUuid();
      const upgraded = server.upgrade(req, {
        data: { clientId, userId: userId, name: user.name, email: user.email },
      });

      if (upgraded) {
        return undefined;
      }

      return new Response("Upgrade failed", { status: 500 });
    },
    websocket: {
      async open(ws) {
        //! Una nueva conexión
        //! Suscribir el cliente a un canal por defecto
        ws.subscribe(SERVER_CONFIG.defaultChannelName);
        ws.subscribe(ws.data.userId);

        /*
         *se deberia de comprobar que un usuario no abra varias conexiones al mismo tiempo, o manejarlo de alguna forma
         *en el map de usuarios conectados (store), podríamos almacenar un array o contador de conexiones por usuario, y permitir múltiples conexiones (evento desconectado cuando el contador llegue a 0)
         *o simplemente no permitirlo y cerrar la conexión anterior si se abre una nueva conexión con el mismo usuarioId
         */
        //! Cuando nos conectamos
        const groupMessages = await handleGetGroupMessages();

        ws.send(JSON.stringify(groupMessages));

        const connectedUsersMessage = handleAddConnectedUser({
          id: ws.data.userId,
          name: ws.data.name,
          email: ws.data.email,
        });
        ws.send(JSON.stringify(connectedUsersMessage));
        ws.publish(
          SERVER_CONFIG.defaultChannelName,
          JSON.stringify(connectedUsersMessage),
        );
      },
      async message(ws, message: string) {
        //* Todos los mensajes que llegan al servidor de la misma forma
        // Se envía a un Handler General
        const response = await handleMessage(message, ws.data);

        for (const message of response.personal) {
          ws.send(JSON.stringify(message));
        }

        for (const message of response.broadcast) {
          //* Si quisiera enviar a un grupo especifico, al abrir conexion el cliente se suscribiría a un canal con el id del grupo, y aquí publicaríamos en ese canal específico
          ws.publish(response.broadcastTo, JSON.stringify(message));
        }
      },
      close(ws, code, message) {
        //! Una vez que el cliente se desconecta, "de-suscribir" del canal por defecto
        ws.unsubscribe(SERVER_CONFIG.defaultChannelName);
        ws.unsubscribe(ws.data.userId);

        //* no se deberia de reconstruir la lista de usuarios cada vez que un usuario se conecta o desconecta, sino mantener una lista actualizada de usuarios conectados en memoria, y simplemente enviar esa lista actualizada a los clientes cada vez que haya un cambio (usuario conectado o desconectado)
        const connectedUsersMessage = handleRemoveConnectedUser(ws.data.userId);
        ws.publish(
          SERVER_CONFIG.defaultChannelName,
          JSON.stringify(connectedUsersMessage),
        );
      }, // a socket is closed
    }, // handlers
  });

  return server;
};
