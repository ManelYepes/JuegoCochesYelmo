export default {
    async fetch(request) {
        // Detectar si la solicitud es un WebSocket
        const upgradeHeader = request.headers.get("Upgrade");
        if (upgradeHeader && upgradeHeader.toLowerCase() === "websocket") {
            // Crear pares de WebSocket (cliente y servidor)
            const [client, server] = Object.values(new WebSocketPair());
            server.accept(); // Aceptar la conexión del WebSocket

            // Manejar mensajes entrantes
            server.addEventListener("message", (event) => {
                const mensaje = event.data; // Recibe el mensaje del cliente
                console.log(`Mensaje recibido: ${mensaje}`);
                
                // Reenviar el mensaje recibido al cliente conectado
                server.send(mensaje); // Devuelve el mensaje al otro lado
            });

            // Responder con el WebSocket activo
            return new Response(null, {
                status: 101,
                webSocket: client,
            });
        }

        // Respuesta predeterminada para las solicitudes HTTP normales
        return new Response("Servidor WebSocket activo en Cloudflare Workers");
    },
};
