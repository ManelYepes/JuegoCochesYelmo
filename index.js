export default {
    fetch(req, env) {
        // Maneja las conexiones WebSocket
        if (req.headers.get("Upgrade") === "websocket") {
            const { 0: client, 1: server } = new WebSocketPair();
            server.accept();

            // Evento de mensaje
            server.addEventListener("message", (event) => {
                console.log("Mensaje recibido: ", event.data);
                // Envía el mensaje recibido a todos los clientes conectados
                server.send(event.data);
            });

            return new Response(null, {
                status: 101,
                webSocket: client
            });
        }

        // Responde con un 404 si no es WebSocket
        return new Response("No WebSocket connection", { status: 404 });
    }
};
