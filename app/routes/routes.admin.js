import { Router } from "express";
import { verifyToken } from "../middlewares/oauth.js";
import { logueoUsuario, validarToken } from "../controllers/userController.js";
import { actualizarPoliticasBloqueo } from "../controllers/blockingPoliciesController.js"; // Importa el controlador
import { desbloquearUsuario, listarBloqueos } from "../controllers/controllers.js";

const rutaAdmin = Router();

// rutaAdmin.get("/", () => {});

rutaAdmin.get("/oauth", verifyToken, validarToken);

rutaAdmin.get("/bloqueos", listarBloqueos);

rutaAdmin.put("/desbloqueo", desbloquearUsuario);

rutaAdmin.post("/login", logueoUsuario);

// Nueva ruta para actualizar las políticas de bloqueo
rutaAdmin.post("/update-blocking-policies", verifyToken, actualizarPoliticasBloqueo);

export default rutaAdmin;
