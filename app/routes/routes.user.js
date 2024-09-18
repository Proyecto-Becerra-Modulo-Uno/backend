import Router from "express";
import { actualizarPoliticasSeguridad, actualizarTiempoIntentos, asignarRolUsuario, bloquearUsuario, crearUsuario, listarPoliticasSeguridad, listarSesiones, listarUser, logueoUsuario, registroInicioSesión } from "../controllers/userController.js";
import { ActualizarEstado, GETModulosYpermisos } from "../controllers/controller.modulos.permisos.js";

const userRout = Router();

userRout.get("/", listarUser);
userRout.post("/", crearUsuario);
userRout.get("/inicios", listarSesiones)
userRout.post('/asignar-rol', asignarRolUsuario);
userRout.post('/login', logueoUsuario);
userRout.post("/historial-sesion", registroInicioSesión);
userRout.put("/estado/:id", bloquearUsuario);
userRout.put("/actualizar-politicas", actualizarPoliticasSeguridad);
userRout.get("/listar-politicas", listarPoliticasSeguridad);
userRout.put("/actualizar-tiempo", actualizarTiempoIntentos);
userRout.put("/estado/:id", bloquearUsuario)
userRout.get("/modulos", GETModulosYpermisos);
userRout.post("/estado", ActualizarEstado);

export default userRout;