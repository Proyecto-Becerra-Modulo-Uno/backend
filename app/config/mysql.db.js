import { createPool } from "mysql2/promise";
import { config } from "dotenv";

config();

export const basedatos = createPool({
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    port: process.env.MYSQLPORT || 3306,
    database: process.env.MYSQLDATABASE,
    uri: process.env.MYSQLURI,
})
