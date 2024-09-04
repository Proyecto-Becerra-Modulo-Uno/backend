const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const   
    client = twilio(accountSid, authToken);

async function   
    sendVerificationCode(phoneNumber) {
  // ... código para enviar el código de verificación
}

module.exports = {
    sendVerificationCode,
};