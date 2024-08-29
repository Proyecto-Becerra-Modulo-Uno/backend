import {Router} from "express";
import { verifyToken } from "../middlewares/oauth.js";
import { logueoUsuario, validarToken } from "../controllers/userController.js";

const rutaAdmin = Router();

rutaAdmin.get("/", ()=>{})

rutaAdmin.get("/oauth", verifyToken, validarToken)
rutaAdmin.post("/login", logueoUsuario)

export default rutaAdmin;