import { Router } from "express";
import { verifyToken } from "../middlewares/oauth.js";
import { logueoUsuario, updatePhoneNumber, validarToken } from "../controllers/userController.js";
import { actualizarPoliticasBloqueo } from "../controllers/blockingPoliciesController.js"; // Importa el controlador
import { desbloquearUsuario, listarBloqueos } from "../controllers/controllers.js";
import { backupDatabase, restoreDatabase, listBackups, listUserBackups, backupUserData, restoreUserData } from "../controllers/backupController.js";
import { getAllCertificates, renewCertificate } from "../controllers/certificateController.js";
import { crear_intervalo_contrasena, listar_grupos } from "../controllers/userController.js";
import { contarActividadesPorDia, contarAdministradoresPorEstado, contarCertificadosPorEstado, obtenerActividadesSospechosas, obtenerAdministradoresActivos, obtenerEstadoCertificados, obtenerPoliticasBloqueo } from "../controllers/securityController.js";

const rutaAdmin = Router();

// rutaAdmin.get("/", () => {});

rutaAdmin.get("/oauth", verifyToken, validarToken);

rutaAdmin.get("/bloqueos", listarBloqueos);

rutaAdmin.put("/desbloqueo", desbloquearUsuario);

rutaAdmin.post("/login", logueoUsuario);

// Nueva ruta para actualizar las políticas de bloqueo
rutaAdmin.post("/update-blocking-policies", verifyToken, actualizarPoliticasBloqueo);


rutaAdmin.get("/token", verifyToken);
rutaAdmin.get('/user-backups', listUserBackups);
rutaAdmin.post('/user-backup', backupUserData);
rutaAdmin.post('/restore-users', restoreUserData);
rutaAdmin.get('/backups', listBackups);
rutaAdmin.post('/backup', backupDatabase);
rutaAdmin.post('/restore', restoreDatabase);
rutaAdmin.get('/certificates', getAllCertificates);
rutaAdmin.post('/certificates/renew/:id', renewCertificate);
rutaAdmin.post("/oauth", verifyToken, validarToken)
rutaAdmin.get("/oauth", verifyToken, validarToken)
rutaAdmin.post("/login", logueoUsuario)
rutaAdmin.get("/listar-grupos", listar_grupos)
rutaAdmin.put("/actualizar-intervalo", crear_intervalo_contrasena)
rutaAdmin.put("/update-phone", verifyToken, updatePhoneNumber);


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
