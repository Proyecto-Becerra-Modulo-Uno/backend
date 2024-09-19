import Router from "express";
import { actualizarPoliticasSeguridad, actualizarTiempoIntentos, addParticipantes, asignarRolUsuario, bloquearUsuario, bloquearUsuarioIntentos, crearGrupo, crearUsuario, getLogs, listarPoliticasSeguridad, listarSesiones, listarUser, logueoUsuario, obtenerGrupo, registroInicioSesión } from "../controllers/userController.js";

const userRout = Router();

userRout.get("/", listarUser);
userRout.post("/", crearUsuario);
userRout.get("/inicios", listarSesiones);
// userRout.post('/asignar-rol', asignarRolUsuario);
userRout.post('/login', logueoUsuario);
userRout.post("/historial-sesion", registroInicioSesión);
userRout.put("/estado/:id", bloquearUsuario);
userRout.put("/actualizar-politicas", actualizarPoliticasSeguridad);
userRout.get("/listar-politicas", listarPoliticasSeguridad);
userRout.put("/actualizar-tiempo", actualizarTiempoIntentos);
userRout.post("/crear-grupo", crearGrupo);
userRout.post("/add-integrante", addParticipantes);
userRout.get("/ultimo-grupo", obtenerGrupo);
userRout.put("/estado/:id", bloquearUsuario);
userRout.put("/bloquearIntentos",  bloquearUsuarioIntentos);
userRout.get("/logs-prueba", getLogs)


export default userRout;