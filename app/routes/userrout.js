import Router from "express";
import { asignarRolUsuario, crearUsuario, listarUser, logueoUsuario } from "../controllers/userController.js";

const userRout = Router();

userRout.get("/", listarUser);
userRout.post("/", crearUsuario);
userRout.post('/asignar-rol', asignarRolUsuario);
userRout.post('/login', logueoUsuario)

export default userRout;