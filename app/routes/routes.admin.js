import {Router} from "express";
import { verifyToken } from "../middlewares/oauth.js";
import { listar_grupos, logueoUsuario, validarToken } from "../controllers/userController.js";

const rutaAdmin = Router();

rutaAdmin.get("/oauth", verifyToken, validarToken)
rutaAdmin.post("/login", logueoUsuario)
rutaAdmin.get("/listar-grupos", listar_grupos)
export default rutaAdmin;