// controllers/authController.js
import { basedatos } from "../config/mysql.db.js";
import { error, success } from "../messages/browr.js";
import { sendVerificationCode as sendTwilioCode, verifyCode as verifyTwilioCode } from "../services/twilio.service.js";

export const updateVerificationStatus = async (req, res) => {
    try {
        const adminId = req.body.id_admin;

        if (!adminId) {
            return error(req, res, 400, "Faltan parámetros requeridos.");
        }

        const estado = 1;

        const [result] = await basedatos.query(
            "CALL UpdateVerificationDouble(?, ?)",
            [adminId, estado]
        );

        if (result.affectedRows > 0) {
            return success(req, res, 200, "Estado de verificación actualizado a activado correctamente.");
        } else {
            return error(req, res, 404, "No se encontró el registro para actualizar.");
        }
    } catch (err) {
        console.error("Error detallado:", err);
        return error(req, res, 500, `Error en el servidor: ${err.message} - Código: ${err.code}`);
    }
};

export const sendVerificationCode = async (req, res) => {
    const { userId, phoneNumber } = req.body;

    try {
        const [rows] = await basedatos.query(
            "SELECT estado_v FROM verificacion_doble WHERE id_admin = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const { estado_v } = rows[0];

        if (estado_v === 1) {
            const sid = await sendTwilioCode(phoneNumber);
            return res.status(200).json({ message: "Verification code sent", sid });
        } else {
            return res.status(400).json({ message: "Two-step verification is not enabled" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const verifyCode = async (req, res) => {
    const { userId, phoneNumber, code } = req.body;

    try {


        const [rows] = await basedatos.query(
            "SELECT estado_v FROM verificacion_doble WHERE id_admin = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const { estado_v } = rows[0];

        if (estado_v === 1) {
            const isVerified = await verifyTwilioCode(phoneNumber, code);

            if (isVerified) {
                return res.status(200).json({ message: "Verification successful" });
            } else {
                return res.status(400).json({ message: "Verification failed" });
            }
        } else {
            return res.status(400).json({ message: "Two-step verification is not enabled" });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const obtenerLogSeguridad = async(req, res) => {
    try {
      const [rows] = await basedatos.query('CALL obtener_log_seguridad()');
      //res.json(rows[0]);
      success(req, res, 200, rows[0])
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      res.status(500).json({ error: 'Error al obtener los datos' });
    }
}
