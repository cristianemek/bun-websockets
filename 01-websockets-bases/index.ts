import index from "./public/index.html";

type WebSocketData = {
  channelId: string;
  xToken: string;
  session : Session;
};

type Session = {
  id: number;
  sessionId: string;
}

const server = Bun.serve({
    port: 3100,
    routes: {
        "/": index,
    },
  fetch(req, server) {
    const cookies = new Bun.CookieMap(req.headers.get('cookie')!);
    const channelId = new URL(req.url).searchParams.get('channelId') || 'general-chat';
    const xToken = cookies.get('X-Token');
    const session= cookies.get('session') ? JSON.parse(cookies.get('session')!) : {};

    if (!xToken) return new Response("Unauthorized", { status: 401 });
    if (!session || !session.sessionId) return new Response("Unauthorized", { status: 401 });

    server.upgrade(req, { data: 
      { channelId, xToken, session } });

    // // upgrade the request to a WebSocket
    // if (server.upgrade(req)) {
    //   return; // do not return a Response
    // }
    // return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    data:{} as WebSocketData,
    message(ws, message: string) {
        // console.log({ws,message})
        // ws.send(message.toUpperCase());
        ws.publish('general-chat', message)
        ws.send(message)
    }, // a message is received
    open(ws) {
      console.log('Cliente conectado')
      ws.subscribe('general-chat')
    }, // a socket is opened
    close(ws, code, message) {
        console.log('Cliente desconectado')
    }, // a socket is closed
    // drain(ws) {}, // the socket is ready to receive more data}, // handlers
},
});

console.log(`Escuchando puerto ${server.url}`)
