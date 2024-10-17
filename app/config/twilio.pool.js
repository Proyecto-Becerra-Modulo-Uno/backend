import { config } from "dotenv";
import twilio from 'twilio';
import sgMail from '@sendgrid/mail';

// Cargar variables de entorno desde el archivo .env
config();

// Obtener las variables de entorno
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authTokenTwilio = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID; // Service SID para el servicio de verificación
// Obtener la clave API de SendGrid
const sendGridApiKey = process.env.SENDGRID_API_KEY; // Agregar la API Key de SendGrid

// Inicializar el cliente de Twilio
const client = twilio(accountSid, authTokenTwilio);

// Inicializar SendGrid con la API Key
sgMail.setApiKey(sendGridApiKey);

// Exportar el cliente y el serviceSid
export { client, serviceSid };
