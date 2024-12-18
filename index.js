export default {
  async fetch(request, env) {
    if (request.headers.get("Upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 426 });
    }

    const [client, server] = Object.values(new WebSocketPair());
    server.accept();

    server.addEventListener("message", (event) => {
      console.log("Mensaje recibido:", event.data);
      server.send(event.data); // Reenviar mensaje al frontend
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  },
};
