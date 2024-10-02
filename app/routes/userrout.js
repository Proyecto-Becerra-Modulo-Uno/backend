import Router from "express";


import {crearUsuario, listarUser, logueoUsuario, contrasena } from "../controllers/userController.js";

import { asignarRolUsuario, changeUserStatus, crearUsuario, listarUser } from "../controllers/userController.js";

import { asignarRolUsuario, crearUsuario, listarUser, logueoUsuario, contrasena } from "../controllers/userController.js";
import { checkIPWhitelist } from "../middlewares/checkIPBlacklist.js";


const userRout = Router();

userRout.get("/", checkIPWhitelist, listarUser);
userRout.post("/", crearUsuario);

// userRout.post('/asignar-rol', asignarRolUsuario);
userRout.post('/login', logueoUsuario)
userRout.post('/contrasena', contrasena )


userRout.post('/asignar-rol', asignarRolUsuario);
userRout.put('/:userId/status', changeUserStatus);


export default userRout;


