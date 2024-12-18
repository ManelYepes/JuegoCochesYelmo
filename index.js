addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Servir tu index.html y controlar WebSockets
  const url = new URL(request.url);

  // Si la petición es para WebSocket
  if (url.pathname === "/ws") {
    return handleWebSocket(request);
  }

  // Servir archivos estáticos (index.html o controller.html)
  return new Response("Hello from Worker", { status: 200 });
}

function handleWebSocket(request) {
  const { 0: client, 1: server } = new WebSocketPair();

  server.accept();

  server.addEventListener("message", (event) => {
    console.log("Mensaje recibido:", event.data);
    server.send("Mensaje recibido: " + event.data);
  });

  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}
