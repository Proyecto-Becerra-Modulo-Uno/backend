import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { error } from "../messages/browr.js";
import session from 'express-session'; 
config();

export const verifyToken = async (req, res, next) =>{
    const token = req.headers["x-access-token"];
    try{
        const valida = await jwt.verify(
            token,
            process.env.TOKENPRIVATEKEY
        );
        next();
    } catch (e) {
        error(req, res, 401, e)
    }
}
// Tiempo de Expiracion
const sessionConfig = session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 3600000 // 1 hora
    }
});

export default sessionConfig;

