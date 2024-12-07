const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const QRCode = require('qrcode');  // Asegúrate de tener instalado este paquete con npm install qrcode
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Sirve todos los archivos estáticos (como game.html y controller.html) desde la raíz
app.use(express.static(__dirname));

// Ruta para mostrar el QR en la pantalla del ordenador
app.get('/qr', (req, res) => {
    const url = `https://1dce-2a0c-5a84-b405-8500-187-d0cb-db82-5d76.ngrok-free.app`; // Reemplaza con tu URL pública
    QRCode.toDataURL(url, (err, src) => {
        if (err) {
            res.status(500).send("Error al generar el QR");
        } else {
            res.send(`
                <h1>Escanea este código QR para jugar desde tu móvil</h1>
                <img src="${src}">
            `);
        }
    });
});


// Socket.IO para la comunicación en tiempo real
io.on('connection', (socket) => {
    console.log('Un cliente se ha conectado');

    socket.on('moverCuadrado', (direccion) => {
        io.emit('moverCuadrado', direccion);
    });

    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});


// Función para obtener la dirección IP local
function getIPAddress() {
    const interfaces = os.networkInterfaces();
    for (let devName in interfaces) {
        let iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            let alias = iface[i];
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}
