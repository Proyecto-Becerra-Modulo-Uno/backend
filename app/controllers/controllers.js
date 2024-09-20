import { basedatos } from "../config/mysql.db";
import { success, error } from "../messages/browser.js";

export const actualizarLongitudContrasena = async (req, res) => {
    const { longitud_minima_contrasena } = req.body;

    if (!longitud_minima_contrasena || isNaN(longitud_minima_contrasena)) {
        return res.status(400).json({ message: 'Debe proporcionar un valor numérico para la longitud mínima de la contraseña' });
    }

    try {
        // aca se va a llamar el procedimiento almacenado
        await db.query(
            'CALL sp_actualizar_longitud_contrasena', 
            [longitud_minima_contrasena]
        );

        res.status(200).json({ message: 'Longitud mínima de la contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la longitud mínima de la contraseña' });
    }
};



export const listarBloqueos = async (req, res)=> {
    try {
        const request = await basedatos.query("CALL SP_CUENTAS_BLOQUEADAS()");
        success(req, res, 200, request[0][0])
    } catch (err) {
        console.error(err);
        return error(req, res, 500, "No se pudo traer la lista de bloqueos")
    }
}

export const desbloquearUsuario = async(req, res) => {
    const { id } = req.body;
    try {
        const request = await basedatos.query(`CALL SP_CUENTAS_DESBLOQUEADAS(?)`, [id]);
        success(req, res, 200, "si se pudo actulizar el estado")
    } catch (err) {
        console.error(err);
        return error(req, res, 500, "No se pudo actualizar el estado")
    }
}