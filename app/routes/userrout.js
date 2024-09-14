import Router from "express";
import { asignarRolUsuario, crearUsuario, listarUser } from "../controllers/userController.js";

const userRout = Router();

userRout.get("/", listarUser);
userRout.post("/", crearUsuario);
userRout.post('/asignar-rol', asignarRolUsuario);

export default userRout;