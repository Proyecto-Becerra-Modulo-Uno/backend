import {Router} from "express";
import { verifyToken } from "../middlewares/oauth.js";
import { crear_intervalo_contrasena, listar_grupos, logueoUsuario, validarToken } from "../controllers/userController.js";
import { contarActividadesPorDia, contarAdministradoresPorEstado, contarCertificadosPorEstado, obtenerActividadesSospechosas, obtenerAdministradoresActivos, obtenerEstadoCertificados, obtenerPoliticasBloqueo } from "../controllers/securityController.js";

const rutaAdmin = Router();

rutaAdmin.post("/oauth", verifyToken, validarToken)
rutaAdmin.post("/login", logueoUsuario)
rutaAdmin.get("/listar-grupos", listar_grupos)
rutaAdmin.put("/actualizar-intervalo", crear_intervalo_contrasena)

// Ruta para obtener actividades sospechosas
rutaAdmin.get('/actividades-sospechosas', obtenerActividadesSospechosas);

// Ruta para contar actividades por día
rutaAdmin.get('/actividades-por-dia', contarActividadesPorDia);

// Ruta para obtener el estado de los certificados
rutaAdmin.get('/estado-certificados', obtenerEstadoCertificados);

// Ruta para contar certificados por estado
rutaAdmin.get('/certificados-por-estado', contarCertificadosPorEstado);

// Ruta para obtener administradores activos
rutaAdmin.get('/administradores-activos', obtenerAdministradoresActivos);

// Ruta para contar administradores por estado
rutaAdmin.get('/administradores-por-estado', contarAdministradoresPorEstado);

// Ruta para obtener políticas de bloqueo
rutaAdmin.get('/politicas-bloqueo', obtenerPoliticasBloqueo);

export default rutaAdmin;