// services/twilio.service.js
import { client, serviceSid } from "../config/twilio.pool.js";
import sgMail from "@sendgrid/mail";

export async function sendVerificationCode(phoneNumber) {
    try {
        const verification = await client.verify.v2
            .services(serviceSid)
            .verifications
            .create({ to: phoneNumber, channel: "call" });
        return verification.sid;
    } catch (error) {
        throw new Error(`el codigo no fue enviado: ${error.message}`);
    }
}

export async function verifyCode(phoneNumber, code) {
    try {
        const verificationCheck = await client.verify.v2
            .services(serviceSid)
            .verificationChecks
            .create({ to: phoneNumber, code });

        return verificationCheck.status === "approved";
    } catch (error) {
        throw new Error(`Failed to verify code: ${error.message}`);
    }
}

export const enviarEmailRecuperacion = async (email, codigoRecuperacion) => {
    try {
        const msg = {
        to: email,
        from: 'maeinela251987@gmail.com',
        subject: 'Recuperación de contraseña',
        text: `Tu código de recuperación es: ${codigoRecuperacion}`,
        html: `<strong>Tu código de recuperación es: ${codigoRecuperacion}</strong>`,
        }
        await sgMail.send(msg);
        return { success: true, message: 'Correo enviado con exito'};
    } catch (error) {
        console.error('Error enviando correo:', error);
        return { success: false, message: 'Error enviando correo'};
    }
};