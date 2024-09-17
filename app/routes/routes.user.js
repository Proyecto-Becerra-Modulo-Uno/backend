import Router from "express";
import { actualizarPoliticasRetencion, actualizarPoliticasSeguridad, asignarRolUsuario, bloquearUsuario, crearUsuario, listarPoliticasSeguridad, listarSesiones, listarUser, logueoUsuario, registroInicioSesión } from "../controllers/userController.js";

const userRout = Router();

userRout.get("/", listarUser);
userRout.post("/", crearUsuario);
userRout.get("/inicios", listarSesiones)
userRout.post('/asignar-rol', asignarRolUsuario);
userRout.post('/login', logueoUsuario)
userRout.post("/historial-sesion", registroInicioSesión)
userRout.put("/estado/:id", bloquearUsuario)
userRout.put("/actualizar-politicas", actualizarPoliticasSeguridad)
userRout.get("/listar-politicas", listarPoliticasSeguridad)
userRout.post("/datos", actualizarPoliticasRetencion);
export default userRout;