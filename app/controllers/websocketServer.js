// websocketServer.js
const WebSocket = require('ws');
const server = require('express'); // Importa tu servidor Express

const wss = new WebSocket.Server({ server });

wss.on('connection', ws => {
    console.log('Cliente conectado');

    // Enviar datos de seguridad en tiempo real
    setInterval(() => {
        const securityData = getSecurityData(); // Función para obtener datos de seguridad
        ws.send(JSON.stringify(securityData));
    }, 5000); // Actualiza cada 5 segundos

    ws.on('message', message => {
        console.log(`Mensaje recibido: ${message}`);
    });

    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
});

function getSecurityData() {
    // Aquí deberías conectar con tus servicios o bases de datos para obtener datos reales
    return {
        alertCount: 10, // Ejemplo de datos
        activeUsers: 5,
        securityIncidents: 2
    };
}
