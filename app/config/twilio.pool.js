import { config } from "dotenv";
import twilio from 'twilio';

// Cargar variables de entorno desde el archivo .env
config();

// Obtener las variables de entorno
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authTokenTwilio = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID; // Service SID para el servicio de verificación

// Inicializar el cliente de Twilio
const client = twilio(accountSid, authTokenTwilio);

// Exportar el cliente y el serviceSid
export { client, serviceSid };
