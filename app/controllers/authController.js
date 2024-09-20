// controllers/authController.js
import { basedatos } from "../config/mysql.db.js";
import { error, success } from "../messages/browser.js";
import { sendVerificationCode as sendTwilioCode, verifyCode as verifyTwilioCode } from "../services/twilio.service.js";
import jwt from "jsonwebtoken";

export const updateVerificationStatus = async (req, res) => {
    const userEmail = req.userEmail; // Obtener el correo del usuario del `req`

    if (!userEmail) {
        return res.status(400).json({ message: "Email not provided in request" });
    }

    const estado = 1; // El estado para activar la verificación de dos pasos

    try {
        // Actualizar el estado de verificación en la base de datos
        const [result] = await basedatos.query(
            "UPDATE verificacion_doble SET estado_v = ? WHERE id_admin = (SELECT id_admin FROM usuario WHERE email = ?)",
            [estado, userEmail]
        );

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: "Two-step verification status updated successfully" });
        } else {
            return res.status(404).json({ message: "No record found to update" });
        }
    } catch (err) {
        console.error("Detailed error:", err);
        return res.status(500).json({ message: `Server error: ${err.message} - Code: ${err.code}` });
    }
};


export const sendVerificationCode = async (req, res) => {
    const userEmail = req.userEmail; // Obtener el correo del usuario del `req`

    if (!userEmail) {
        return res.status(400).json({ message: "Email not provided in request" });
    }

    try {
        // Obtener el número de teléfono del usuario a partir del correo electrónico
        const [userRows] = await basedatos.query(
            "SELECT telefono FROM usuario WHERE email = ?",
            [userEmail]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const { telefono } = userRows[0];

        // Enviar el código al número de teléfono
        const sid = await sendTwilioCode(telefono);
        return res.status(200).json({ message: "Verification code sent", sid });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const verifyCode = async (req, res) => {
    const { code } = req.body; // Solo se recibe el código en el cuerpo de la solicitud

    const userEmail = req.userEmail; // Obtener el correo del usuario del `req`

    if (!userEmail) {
        return res.status(400).json({ message: "Email not provided in request" });
    }

    try {
        // Obtener el número de teléfono del usuario a partir del correo electrónico
        const [userRows] = await basedatos.query(
            "SELECT telefono FROM usuario WHERE email = ?",
            [userEmail]
        );

        if (userRows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const { telefono } = userRows[0];

        // Verificar el código enviado al número de teléfono
        const isVerified = await verifyTwilioCode(telefono, code);

        if (isVerified) {
            return res.status(200).json({ message: "Verification successful" });
        } else {
            return res.status(400).json({ message: "Verification failed" });
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

