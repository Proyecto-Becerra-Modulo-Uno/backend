import { createPool } from "mysql2/promise";
import { config } from "dotenv";

config();

export const basedatos = createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    port: process.env.MYSQLPORT || 3306,
    database: process.env.MYSQLDATABASE,
})


// Función para cerrar el pool de conexiones
async function shutdown() {
    try {
        await basedatos.end();
        console.log('Pool de conexiones cerrado correctamente');
    } catch (error) {
        console.error('Error al cerrar el pool de conexiones:', error);
    } finally {
        process.exit(0); // Finaliza el proceso
    }
}

// Maneja las señales de cierre del proceso
process.on('SIGINT', shutdown); // Ctrl+C en la terminal
process.on('SIGTERM', shutdown); // Señal de terminación del sistema