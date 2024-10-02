const express = require('express');
const axios = require('axios');

const app = express();

// Lista de países permitidos o bloqueados
const ALLOWED_COUNTRIES = ['US', 'CA']; // Puedes cambiar esto por una lista de países permitidos
const BLOCKED_COUNTRIES = ['CN', 'RU']; // Lista de países bloqueados

// Middleware para bloqueo geográfico
export const geoBlockMiddleware = async (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress; // Obtener la IP del cliente

    try {
        // Llamada a la API de ip-api para obtener la geolocalización
        const geoData = await axios.get(`http://ip-api.com/json/${ip}`);
        const { countryCode } = geoData.data;

        // Verificar si la IP está en un país permitido o bloqueado
        if (BLOCKED_COUNTRIES.includes(countryCode)) {
            return res.status(403).send('Access blocked: Your country is not allowed to access this site.');
        }

        if (ALLOWED_COUNTRIES.length > 0 && !ALLOWED_COUNTRIES.includes(countryCode)) {
            return res.status(403).send('Access blocked: Your country is not in the allowed list.');
        }

        // Si la IP es de un país permitido, continuar
        next();
    } catch (error) {
        console.error('Error fetching geolocation:', error);
        return res.status(500).send('Error with geolocation service.');
    }
};

