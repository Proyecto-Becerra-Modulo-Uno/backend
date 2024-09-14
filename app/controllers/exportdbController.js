import { Parser } from 'json2csv';
import { basedatos } from "../config/mysql.db.js";
import { error, success } from "../messages/browser.js";

export const exportDatabase = async (req, res) => {
    let connection;
    try {
        connection = await basedatos.getConnection();
        const [tables] = await connection.query('SHOW TABLES');
        const exportData = {};

        // Exportar datos de cada tabla
        for (const tableRow of tables) {
        const tableName = Object.values(tableRow)[0]; // Obtiene el nombre de la tabla
        const [rows] = await connection.query(`SELECT * FROM ${tableName}`);
        exportData[tableName] = rows;
        }

        // console.log('Datos exportados:', JSON.stringify(exportData, null, 2));

        // Verificar si hay datos para exportar
        if (Object.keys(exportData).length === 0) {
        throw new Error('No hay datos para exportar');
        }

        // Preparar los datos para CSV
        const flattenedData = Object.entries(exportData).flatMap(([tableName, rows]) => 
        rows.map(row => ({ table: tableName, ...row }))
        );

        // Convertir a CSV
        const parser = new Parser({ flatten: true });
        const csv = parser.parse(flattenedData);

        // Configurar la respuesta
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=database_export.csv');

        // Enviar el CSV como respuesta
        res.send(csv);
    } catch (err) {
        console.error('Error al exportar la base de datos:', err);
        error(req, res, 500, err.message || "Error al exportar la base de datos");
    } finally {
        if (connection) connection.release();
    }
};