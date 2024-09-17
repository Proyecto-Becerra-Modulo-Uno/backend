import jwt from "jsonwebtoken";
import { config } from "dotenv";
import session from 'express-session'; 
import { error } from "../messages/browser.js"; 

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

