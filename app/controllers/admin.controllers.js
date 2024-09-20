import bcrypt from "bcrypt";
import { basedatos } from "../config/mysql.db.js";
import jwt from "jsonwebtoken";
import { error, success } from "../messages/browser.js";

export const registroInicioSesion = async (req, res) => {
    const {id, ip, platform} = req.body;
    try {
        const request = await basedatos.query("CALL SP_INSERTAR_HISTORIAL_SESION_USUARIO(?,?,?)", [id, ip, platform]);
        success(req, res, 201, {id:id, ip:ip, platform:platform})        
    } catch (e) {
        console.error(e);
        return error(req, res, 500, "Error en el servidor")
    }
}

export const listarPoliticasSeguridad = async(req, res) => {
    try {
        const request = await basedatos.query("CALL SP_LISTAR_POLI()");
        success(req, res, 200, request[0][0]);
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error al listar políticas");
    }
}


export const asignarRolUsuario = async (req, res) => {
    const { usuarioId, rolId } = req.body;

    if (!usuarioId || !rolId) {
        return error(req, res, 400, "Se requieren usuarioId y rolId");
    }

    try {
        const [resultado] = await basedatos.query('CALL AsignarRolUsuario(?, ?)', [usuarioId, rolId]);
        const mensaje = resultado[0][0].mensaje;

        if (mensaje === 'Rol asignado correctamente') {
            success(req, res, 200, { mensaje });
        } else {
            error(req, res, 400, { mensaje });
        }
    } catch (err) {
        error(req, res, 500, err.message || "Error interno del servidor");
    }
};

export const bloquearUsuario = async(req, res) => {
    const {id} = req.params;
    const {estado} = req.body;
    try {
        const request = await basedatos.query("CALL SP_ACTUALIZAR_ESTADO_USUARIO(?,?)", [id, estado]);
        success(req, res, 201, "Estado del usuario actualizado")
    } catch (err) {
        console.error(err);
        return error(req, res, 500, "No se pudo actualizar el estado")
    }
}