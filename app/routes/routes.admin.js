import {Router} from "express";
import { verifyToken } from "../middlewares/oauth.js";
import { validarToken } from "../controllers/userController.js";

const rutaAdmin = Router();

rutaAdmin.get("/", ()=>{})

rutaAdmin.get("/oauth", verifyToken, validarToken)

export default rutaAdmin;