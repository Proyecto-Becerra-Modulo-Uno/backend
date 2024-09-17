// services/twilio.service.js
import { client, serviceSid } from "../config/twilio.pool.js";

export async function sendVerificationCode(phoneNumber) {
    try {
        const verification = await client.verify.v2
            .services(serviceSid)
            .verifications
            .create({ to: phoneNumber, channel: "sms" });
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
