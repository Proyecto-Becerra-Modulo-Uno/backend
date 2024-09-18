import db from "../config/mysql.db.js";

export const actualizarPoliticasBloqueo = (req, res) => {
    const { maxAttempts, blockDuration, notifyAdmins } = req.body;

    // Llamada al procedimiento almacenado
    const query = 'CALL actualizarPoliticasBloqueo(?, ?, ?)';
    const params = [maxAttempts, blockDuration, notifyAdmins ? 1 : 0];

    db.query(query, params, (err, result) => {
        if (err) {
            console.error('Error al actualizar las políticas de bloqueo:', err);
            return res.status(500).json({ error: 'Error al actualizar las políticas de bloqueo' });
        }
        res.status(200).json({ message: 'Políticas de bloqueo actualizadas correctamente' });
    });
};
