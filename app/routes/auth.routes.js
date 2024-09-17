import { Router } from "express";
import { updateVerificationStatus, sendVerificationCode, verifyCode } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.put("/update-status-twuilio", updateVerificationStatus);

 
// Ruta para enviar el código de verificación
authRoutes.post('/send-code', sendVerificationCode);

// Ruta para verificar el código recibido
authRoutes.post('/verify-code', verifyCode);


export default authRoutes;
