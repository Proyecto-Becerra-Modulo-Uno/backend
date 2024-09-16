import Router from "express";
import { asignarRolUsuario, crearUsuario, listarUser, logueoUsuario, contrasena } from "../controllers/userController.js";
import { checkIPWhitelist } from "../middlewares/checkIPBlacklist.js";

const userRout = Router();

userRout.get("/", checkIPWhitelist, listarUser);
userRout.post("/", crearUsuario);
userRout.post('/asignar-rol', asignarRolUsuario);
userRout.post('/login', logueoUsuario)
userRout.post('/contrasena', contrasena )

export default userRout;
