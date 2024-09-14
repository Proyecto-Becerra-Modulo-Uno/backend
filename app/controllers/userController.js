import bcrypt from "bcrypt";
import { basedatos } from "../config/mysql.db";
import { error, success } from "../messages/browser";


export const listarUser = async(req, res) => {
    try {
        const respuesta = await basedatos.query('CALL ObtenerPanelControlUsuarios();');
        success(req, res, 200, respuesta[0][0]);
    } catch (err) {
        error(req, res, 200, err || "Error interno del servidor")
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
export const crearUsuario = async (req, res) => {
    const { usuario, nombre, email, contrasena, contasena } = req.body;

    // Usar contrasena o contasena, lo que esté presente
    const passwordToUse = contrasena || contasena;

    // Verificar que todos los campos requeridos estén presentes
    if (!usuario || !nombre || !email || !passwordToUse) {
      return error(req, res, 400, "Todos los campos son requeridos: usuario, nombre, email, contraseña");
    }

    try {
        // Usar 10 rondas de sal para mayor seguridad
        const hash = await bcrypt.hash(passwordToUse, 10);

        const [respuesta] = await basedatos.query(
            'CALL SP_CrearUsuario(?, ?, ?, ?);',
            [usuario, nombre, hash, email]
        );

        if (respuesta.affectedRows === 1) {
            success(req, res, 201, "Usuario creado exitosamente");
        } else {
            error(req, res, 400, "No se pudo agregar el nuevo usuario");
        }
        } catch (err) {
        console.error("Error al crear usuario:", err);
        error(req, res, 500, "Error interno del servidor al crear usuario");
    }
};