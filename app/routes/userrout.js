import Router from "express";
import { asignarRolUsuario, listarUser } from "../controllers/userController.js";

const userRout = Router();

userRout.get("/", listarUser);
userRout.post('/asignar-rol', asignarRolUsuario);

export default userRout;