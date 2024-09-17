import express from "express";
import cors from "cors";
import { config } from "dotenv";
import ruta from "./routes/index.js";

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 6000);

app.use(cors());

app.use("/", ruta);

document.addEventListener('DOMContentLoaded', () => {
    const alertCountElement = document.getElementById('alertCount');
    const activeUsersElement = document.getElementById('activeUsers');
    const securityIncidentsElement = document.getElementById('securityIncidents');

    const ws = new WebSocket('ws://localhost:8080'); // Cambia la URL según sea necesario

    ws.onopen = () => {
        console.log('Conectado al WebSocket');
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            alertCountElement.textContent = data.alertCount || '0';
            activeUsersElement.textContent = data.activeUsers || '0';
            securityIncidentsElement.textContent = data.securityIncidents || '0';
        } catch (error) {
            console.error('Error al procesar el mensaje del WebSocket:', error);
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket Error:', error);
    };

    ws.onclose = () => {
        console.log('Desconectado del WebSocket');
    };
});

export default app;
