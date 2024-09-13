import bcrypt from "bcrypt";
import { basedatos } from "../config/mysql.db";
import { error, success } from "../messages/browr";
import jwt from "jsonwebtoken";
import userAgent from "user-agent";

export const listarUser = async(req, res) => {
    try {
        const respuesta = await basedatos.query('CALL SP_ObtenerPanelControlUsuarios();');
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
    const { usuario, nombre, email, contrasena, contasena, rol, estado } = req.body;
    const passwordToUse = contrasena || contasena;
    if (!usuario || !nombre || !email || !passwordToUse) {
        return error(req, res, 400, "Todos los campos son requeridos: usuario, nombre, email, contraseña, rol");
    }
    try {
        const hash = await bcrypt.hash(passwordToUse, 10);
        const [respuesta] = await basedatos.query(
            'CALL SP_CrearUsuario(?, ?, ?, ?, ?, ?);',
            [usuario, nombre, hash, email, rol, estado]
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

export const logueoUsuario = async (req, res) => {
    const { usuario, contrasena } = req.body;
    try {
        // Verificar si el usuario existe y obtener su rol y contraseña
        const [request] = await basedatos.query('CALL SP_VERIFICAR_ROLES(?)', [usuario]);
        
        if (request[0].length === 0) {
            console.log('Usuario no encontrado');
            return error(req, res, 404, 'Usuario no existe');
        }

        const userData = request[0][0];
        const { id, id_rol, nombre_usuario, contrasena_hash, nombre, email } = userData;

        const match = await bcrypt.compare(contrasena, contrasena_hash);
        console.log(`Contraseña coincide: ${match}`);

        if (!match) {
            console.log('Contraseña incorrecta');
            return error(req, res, 401, 'Contraseña Incorrecta');
        }

        const [duracionResult] = await basedatos.query('CALL SP_LISTAR_POLI()');
        
        const duracionToken = duracionResult[0][0]?.duracion_token || '1h';

        const payload = {
            rol: id_rol,
            nombre: nombre,
            correo: email,
            usuario: nombre_usuario,
        };

        const token = jwt.sign(payload, process.env.TOKEN_PRIVATEKEY, {
            expiresIn: duracionToken,
        });
        
        const userAgentString = req.headers['user-agent'];
        const osMatch = userAgentString.match(/\(([^)]+)\)/);
        const os = osMatch ? osMatch[1] : 'Unknown OS';
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;        
        success(req, res, 200, { token:token, rol: id_rol, platform: os, ip: ip, id: id });

    } catch (e) {
        console.error(e);
        return error(req, res, 500, 'Error en el servidor, por favor inténtalo de nuevo más tarde');
    }
};



export const validarToken = (req, res) =>{
    success(req, res, 201, {"token" : "El token es valido"});
}

export const registroInicioSesión = async (req, res) => {
    const {id, ip, platform} = req.body;
    try {
        const request = await basedatos.query("CALL SP_INSERTAR_HISTORIAL_SESION_USUARIO(?,?,?)", [id, ip, platform]);
        success(req, res, 201, {id:id, ip:ip, platform:platform})        
    } catch (e) {
        console.error(e);
        return error(req, res, 500, "Error en el servidor")
    }
}

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

export const listarSesiones = async (req, res)=> {
    try {
        const request = await basedatos.query("CALL SP_LISTAR_REGISTROS()");
        success(req, res, 200, request[0][0])
    } catch (err) {
        console.error(err);
        return error(req, res, 500, "No se pudo traer la lista de sesiones")
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

export const actualizarPoliticasSeguridad = (req, res) =>   {
    const {longitud, duracion, frecuencia, intervalo} = req.body;
    try {
        const request = basedatos.query("CALL SP_ACTUALIZAR_POLITICA(?, ?, ?, ?)", [longitud, duracion, frecuencia, intervalo])
        success(req, res, 201, "Politicas ActualIzadas")
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error en la actualización de la duracion del token")
    }
}
export const actualizarTiempoIntentos = (req, res) => {
    const {tiempo, intentos} = req.body;
    try {
        const request = basedatos.query("CALL SP_ACTUALIZAR_TIEMPO_INTENTOS(?, ?)", [intentos, tiempo]);
        success(req, res, 201, "Intentos y tiempo actualizados")
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error actualizando el tiempo y los intentos");
    }
}
export const crearGrupo = async(req, res) => {
    const {nombre, desc} = req.body;
    try {
        const request = await basedatos.query("CALL SP_INSERTAR_GRUPO(?, ?)", [nombre, desc]);
        success(req, res, 201, "Grupo creado")
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error creando grupo");
    }
}
export const obtenerGrupo = async(req, res) => {
    try {
        const request = await basedatos.query("CALL SP_OBTENER_ÚLTIMO_GRUPO()");
        success(req, res, 201, request[0][0])
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error creando grupo");
    }
}
export const addParticipantes = async (req, res) => {
    const { correo, grupo } = req.body;
    try {
        const request = await basedatos.query("CALL SP_ADD_INTEGRANTE(?, ?)", [correo, grupo]);
        success(req, res, 201, "Integrante añadido correctamente");
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error añadiendo integrante");
    }
}

export const listar_grupos = async(req, res) => {
    try {
        const request = await basedatos.query("CALL SP_LISTAR_GRUPOS");
        success(req, res, 201, request[0][0]);
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error listando grupos");
    }
}

export const crear_intervalo_contrasena = async(req, res) => {
    const {tiempo} = req.body;
    try {
        const request = await basedatos.query("CALL SP_ACTUALIZAR_INTERVALO_CAMBIO_CONTRASENA(?)", [tiempo]);
        success(req, res, 201, "Intervalo actualizado");
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error listando grupos");
    }
}