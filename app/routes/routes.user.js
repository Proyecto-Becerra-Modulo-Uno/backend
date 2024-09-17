import Router from "express";

import { actualizarPoliticasRetencion, actualizarPoliticasSeguridad, bloquearUsuario, crearUsuario, listarPoliticasSeguridad, listarSesiones, listarUser, logueoUsuario, registroInicioSesión,actualizarTiempoIntentos } from "../controllers/userController.js";

import { addIpToList, generarPDFRegistrosInicioSesion, obtenerActividadesSospechosas, obtenerRegistrosInicioSesion } from "../controllers/userController.js";


const userRout = Router();

userRout.get("/", listarUser);
userRout.post("/", crearUsuario);
userRout.get("/inicios", listarSesiones)
// userRout.post('/asignar-rol', asignarRolUsuario);
userRout.post('/login', logueoUsuario);
userRout.post("/historial-sesion", registroInicioSesión);
userRout.put("/estado/:id", bloquearUsuario);
userRout.put("/actualizar-politicas", actualizarPoliticasSeguridad);
userRout.get("/listar-politicas", listarPoliticasSeguridad);
userRout.put("/actualizar-tiempo", actualizarTiempoIntentos);
userRout.put("/estado/:id", bloquearUsuario)
userRout.get("/actividades-sospechosas", obtenerActividadesSospechosas);
userRout.get('/registros-inicio-sesion', obtenerRegistrosInicioSesion);
userRout.get('/registros-inicio-sesion-pdf', generarPDFRegistrosInicioSesion);
userRout.post('/addIpToList', addIpToList);

userRout.put("/actualizar-politicas", actualizarPoliticasSeguridad)
userRout.get("/listar-politicas", listarPoliticasSeguridad)
userRout.post("/datos", actualizarPoliticasRetencion);

export default userRout;