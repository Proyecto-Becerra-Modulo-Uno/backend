const pool = require('../db'); // Asegúrate de que esta sea la conexión a tu base de datos

const actualizarLongitudContrasena = async (req, res) => {
    const { longitud_minima_contrasena } = req.body;

    if (!longitud_minima_contrasena || isNaN(longitud_minima_contrasena)) {
        return res.status(400).json({ message: 'Debe proporcionar un valor numérico para la longitud mínima de la contraseña' });
    }

    try {
        // aca se va a llamar el procedimiento almacenado
        await pool.query(
            'CALL sp_actualizar_longitud_contrasena(?)', 
            [longitud_minima_contrasena]
        );

        res.status(200).json({ message: 'Longitud mínima de la contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la longitud mínima de la contraseña' });
    }
};

module.exports = {
    actualizarLongitudContrasena,
};
