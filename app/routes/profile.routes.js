import { Router } from "express";
import { cambiarContrasena, eliminarCuenta, obtenerAccesos } from "../controllers/profileController.js";

const router = Router();

// Ruta para cambiar la contraseña
router.put("/cambiar-contrasena", cambiarContrasena);

// Ruta para eliminar la cuenta
router.delete("/eliminar-cuenta", eliminarCuenta);

// Ruta para obtener accesos
router.get("/accesos/:userId", obtenerAccesos);

export default router;
