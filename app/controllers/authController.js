import { basedatos } from "../config/mysql.db.js";
import { error, success } from "../messages/browr";
import { client, serviceSid } from "../config/twilio.pool.js";

export const updateVerificationStatus = async (req, res) => {
    try {
        const adminId = req.body.id_admin;

    if (!adminId) {
        return error(req, res, 400, "Faltan parámetros requeridos.");
    }

    // El estado se establece en 'activado' directamente
    const estado = "activado";

    // Llama al procedimiento almacenado
    console.log("Parametros enviados:", adminId, estado);

    const [result] = await basedatos.query(
        "CALL UpdateVerificationDouble(?, ?)",
        [adminId, estado]
    );

    console.log("Filas afectadas:", result.affectedRows);

    if (result.affectedRows > 0) {
        return success(
        req,
        res,
        200,
        "Estado de verificación actualizado a activado correctamente."
        );
    } else {
        return error(
        req,
        res,
        404,
        "No se encontró el registro para actualizar."
        );
    }
    } catch (err) {
    console.error("Error detallado:", err);
    return error(
        req,
        res,
        500,
        `Error en el servidor: ${err.message} - Código: ${err.code}`
    );
    } 
};

// ______________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________________

// Función para enviar un código de verificación si está activado
export const sendVerificationCode = async (req, res) => {
    const { userId, phoneNumber } = req.body;

    try {
    // Consultar la base de datos para verificar si la verificación está activada
    const [rows] = await basedatos.query(
        "SELECT estado_v FROM verificacion_doble WHERE id_admin = ?",
        [userId]
    );

    if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    const { estado_v } = rows[0];

    // Verificar si la verificación está activada
    if (estado_v === "activado") {
      // Enviar el código de verificación
        const verification = await client.verify.v2
        .services(serviceSid)
        .verifications
        .create({ to: phoneNumber, channel: "call" });
        return res
        .status(200)
        .json({ message: "Verification code sent", sid: verification.sid });
    } else {
        return res
        .status(400)
        .json({ message: "Two-step verification is not enabled" });
    }
    } catch (error) {
    return res.status(500).json({ error: error.message });
    }
};

// Función para verificar el código recibido
export const verifyCode = async (req, res) => {
    const { userId, phoneNumber, code } = req.body;

    try {

         // Verificar que el número de teléfono esté en el formato correcto
    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number format. Use E.164 format." });
        }
    // Consultar la base de datos para verificar si la verificación está activada
    const [rows] = await basedatos.query(
        "SELECT estado_v FROM verificacion_doble WHERE id_admin = ?",
        [userId]
    );

    if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
    }

    const { estado_v } = rows[0];

    // Verificar si la verificación está activada
    if (estado_v === "activado") {
      // Verificar el código recibido
        const verificationCheck = await client.verify.v2
        .services(serviceSid)
        .verificationChecks
        .create({ to: phoneNumber, code: code });

        if (verificationCheck.status === "approved") {
            return res.status(200).json({ message: "Verification successful" });
        } else {
        return res.status(400).json({ message: "Verification failed" });
        }
    } else {
        return res
        .status(400)
        .json({ message: "Two-step verification is not enabled" });
    }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
