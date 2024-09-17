import bcrypt from "bcrypt";
import { basedatos } from "../config/mysql.db";
import jwt from "jsonwebtoken";
// import userAgent from "user-agent";
import { error, success } from "../messages/browser.js";



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
    const { usuario, nombre, email, contrasena, contasena } = req.body;

    const passwordToUse = contrasena || contasena;

    if (!usuario || !nombre || !email || !passwordToUse) {
        return error(req, res, 400, "Todos los campos son requeridos: usuario, nombre, email, contraseña");
    }

    try {
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

export const logueoUsuario = async (req, res) => {
    const { usuario, contrasena } = req.body;
    try {
        // Verificar si el usuario existe
        const [request] = await basedatos.query('CALL SP_VERIFICAR_ROLES(?)', [usuario]);

        if (request[0].length === 0) {
            // console.log('Usuario no encontrado');
            return error(req, res, 404, 'Usuario no existe');
        }

        const userData = request[0][0];
        const { id, id_rol, nombre_usuario, contrasena_hash, nombre, email } = userData;

        // Verifica que la contraseña coincida
        const match = await bcrypt.compare(contrasena, contrasena_hash);
        console.log(`Contraseña coincide: ${match}`);

        if (!match) {
            console.log('Contraseña incorrecta');
            return error(req, res, 401, 'Contraseña Incorrecta');
        }

        
        const [duracionResult] = await basedatos.query('CALL SP_LISTAR_POLI()');
        const duracionToken = duracionResult[0][0]?.duracion_token || '20m';


        const payload = {
            rol: id_rol,
            nombre: nombre,
            correo: email,
            usuario: nombre_usuario,
        };

        // Token con la clave secreta
        const token = jwt.sign(payload, process.env.TOKEN_PRIVATEKEY, {
            expiresIn: duracionToken,   
        });

        
        const userAgentString = req.headers['user-agent'];
        const osMatch = userAgentString.match(/\(([^)]+)\)/);
        const os = osMatch ? osMatch[1] : 'Unknown OS';
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

        
        success(req, res, 200, { token, rol: id_rol, platform: os, ip, id });

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
        const request = await basedatos.query("CALL SP_LISTAR_POLI()")
        success(req, res, 200, request[0][0])
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error al listar políticas")
    }
}

export const actualizarPoliticasSeguridad = (req, res) => {
    const {longitud, duracion, frecuencia} = req.body;
    try {
        const request = basedatos.query("CALL SP_ACTUALIZAR_POLITICA(?, ?, ?)", [longitud, duracion, frecuencia])
        success(req, res, 201, "Politicas ActualIzadas")
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error en la actualización de la duracion del token")
    }
}


export const actualizarPoliticasRetencion = (req, res) => {
    const { dias_inactividad } = req.body;

    console.log(`Días de inactividad configurados: ${dias_inactividad}`);
 
    res.send('Política de retención actualizada correctamente');
};

export const contrasena = async (req, res) => {
    try {
        const respuesta = await basedatos.query('CALL ObtenerPanelControlUsuarios();');
        if (respuesta[0].affectedRows == 1) {
            let msg = `
                <!DOCTYPE html>
  <html lang="es">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              line-height: 1.6;
              padding: 20px;
          }
          .container {
              background-color: #fff;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              padding: 20px;
              max-width: 600px;
              margin: auto;
          }
          h1 {
              color: #808080;
          }
          p {
              font-size: 2em;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>¡Hola estimado usuario!</h1>
          <p>¡Queremos informarte que tienes que cambiar tu contraseña en nuestra pagina APEX!</p>
          <p>¡Te queremos informar que el cambio de contraseña es obligatorio!</p>
          <p>¡Gracias por tu atención!</p>
      </div>
  </body>
  </html>
            `; 
        } 
    } catch (err) {
        error(req, res, 400, err);
    }
};

export const sendEmail = async (messages, receiverEmail, subject) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL_CORREO,
                pass: process.env.EMAIL_CLAVE
            },
            tls: {
                rejectUnauthorized: false 
            }
        });

        let info = await transporter.sendMail({
            from: process.env.EMAIL_CORREO,
            to: receiverEmail,
            subject: subject,
            html: messages
        });

        console.log("Email enviado:", info.messageId);
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        throw error;
    }
};

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

export const changeUserStatus = async(req, res) => {
    const { userId } = req.params;
    const { newStatus } = req.body;
    try {
        // Llamar al procedimiento almacenado
        const [results] = await basedatos.execute('CALL cambiar_estado_usuario(?, ?)', [userId, newStatus]);
        // Verificar el resultado del procedimiento almacenado
        if (results[0][0].success) {
            success(req, res, 201, "Estado del usuario actualizado correctamente");
        } else {
            success(req, res, 400, "No se pudo actualizar el estado del usuario");
        }
    } catch (error) {
        console.error('Error al cambiar el estado del usuario:', error);
        error(req, res, 500, "Error interno del servidor");
    }
}

