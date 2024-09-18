import { Router } from "express";
import { updateVerificationStatus, sendVerificationCode, verifyCode, obtenerLogSeguridad } from "../controllers/authController.js";
// import { updateVerificationStatus, sendVerificationCode, verifyCode } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/oauth.js";


const authRoutes = Router();

authRoutes.put("/update-status-twuilio", verifyToken, updateVerificationStatus);

 
// Ruta para enviar el código de verificación
authRoutes.post('/send-code',verifyToken, sendVerificationCode);

// Ruta para verificar el código recibido

authRoutes.post('/verify-code', verifyCode);
authRoutes.get('/log_seguridad', obtenerLogSeguridad)

authRoutes.post('/verify-code', verifyToken, verifyCode);


export default authRoutes;
