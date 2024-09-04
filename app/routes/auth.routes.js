const express = require('express');
const router = express.Router();
const verificationMiddleware = require('../middlewares/verification.middleware');

// Ruta para realizar la prueba de verificación
router.post('/verify', verificationMiddleware, (req, res) => {
    res.status(200).json({ message: 'Código de verificación enviado' });
});

module.exports = router;