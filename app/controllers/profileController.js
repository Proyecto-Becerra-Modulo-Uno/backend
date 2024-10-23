import { basedatos } from "../config/mysql.db.js";

// Cambiar contraseña
export const cambiarContrasena = async (req, res) => {
    const { userId, nuevaContrasena } = req.body;
    try {
        const [result] = await basedatos.query(
            "UPDATE usuarios SET contrasena = ? WHERE id = ?",
            [nuevaContrasena, userId]
        );
        res.json({ message: "Contraseña cambiada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al cambiar la contraseña" });
    }
};

// Eliminar cuenta
export const eliminarCuenta = async (req, res) => {
    const { userId } = req.body;
    try {
        await basedatos.query("DELETE FROM usuarios WHERE id = ?", [userId]);
        res.json({ message: "Cuenta eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar la cuenta" });
    }
};

// Obtener accesos
export const obtenerAccesos = async (req, res) => {
    const { userId } = req.params;
    try {
        const [rows] = await basedatos.query(
            "SELECT fecha, accion FROM accesos WHERE usuario_id = ?",
            [userId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los accesos" });
    }
};
