import {Router} from "express";
import { verifyToken } from "../middlewares/oauth.js";
import { logueoUsuario, validarToken,updatePhoneNumber } from "../controllers/userController.js";

const rutaAdmin = Router();

rutaAdmin.get("/", ()=>{})

rutaAdmin.get("/oauth", verifyToken, validarToken)

rutaAdmin.post("/login", logueoUsuario)

rutaAdmin.put("/update-phone", verifyToken, updatePhoneNumber);

export default rutaAdmin;