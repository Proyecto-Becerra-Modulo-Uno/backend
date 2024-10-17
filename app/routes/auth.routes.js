import { Router } from "express";
import { updateVerificationStatus, sendVerificationCode, verifyCode, generarCodigoRecuperacion, verificarCodigo, restablecerContrasena } from "../controllers/authController.js";

const authRoutes = Router();

authRoutes.put("/update-status-twuilio", updateVerificationStatus);

// Ruta para enviar el código de verificación
authRoutes.post('/send-code', sendVerificationCode);

// Ruta para verificar el código recibido
authRoutes.post('/verify-code', verifyCode);

authRoutes.post("/solicitar-recuperacion", generarCodigoRecuperacion);

authRoutes.post("/verificar-codigo", verificarCodigo);

authRoutes.post("/restablecer-contrasena", restablecerContrasena);

export default authRoutes;
