const twilioService = require('../services/twilio.service');

async function verificationMiddleware(req, res, next) {
    try {
    // Lógica para verificar si se requiere un código de verificación
    if (req.path === '/api/auth/signup') {
        await twilioService.sendVerificationCode(req.body.phoneNumber);
    }
    next();
    } catch (error) {
    // Manejo del error, puedes enviar una respuesta de error o pasar el error al siguiente middleware
    console.error('Error sending verification code:', error);
    res.status(500).send({ error: 'Error sending verification code' });
    }
}

module.exports = verificationMiddleware;
hhh
