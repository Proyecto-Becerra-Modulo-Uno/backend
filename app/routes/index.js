import { Router } from "express";
import { validatePassword } from "../controllers/controllers.js";

const router = Router();

// Ruta para validar la contraseña
router.post('/validate-password', validatePassword);

export default router;