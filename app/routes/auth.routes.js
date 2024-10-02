import { Router } from "express";
import { updateVerificationStatus, sendVerificationCode, verifyCode, obtenerLogSeguridad } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/oauth.js";
import { geoBlockMiddleware} from "../middlewares/bloqueoGeografico.middleware.js";

const authRoutes = Router();

authRoutes.put("/update-status-twuilio", verifyToken,geoBlockMiddleware , updateVerificationStatus);


// Ruta para enviar el código de verificación
authRoutes.post('/send-code',verifyToken,geoBlockMiddleware, sendVerificationCode);

// Ruta para verificar el código recibido
authRoutes.post('/verify-code', verifyToken,geoBlockMiddleware, verifyCode);
authRoutes.get('/log_seguridad', obtenerLogSeguridad);


export default authRoutes;
