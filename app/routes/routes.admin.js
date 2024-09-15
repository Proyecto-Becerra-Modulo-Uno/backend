import {Router} from "express";
import { verifyToken } from "../middlewares/oauth.js";
import { crear_intervalo_contrasena, listar_grupos, logueoUsuario, validarToken } from "../controllers/userController.js";

const rutaAdmin = Router();

rutaAdmin.post("/oauth", verifyToken, validarToken)
rutaAdmin.post("/login", logueoUsuario)
rutaAdmin.get("/listar-grupos", listar_grupos)
rutaAdmin.put("/actualizar-intervalo", crear_intervalo_contrasena)
export default rutaAdmin;