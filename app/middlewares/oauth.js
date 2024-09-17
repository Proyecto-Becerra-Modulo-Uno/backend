import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { error } from '../messages/browr.js';
config();

export const verifyToken = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return error(req, res, 403, 'Token not provided.');
    }

    jwt.verify(token, process.env.TOKENPRIVATEKEY, (err, decoded) => {
        if (err) {
            return error(req, res, 401, err.message);
        }
        req.userEmail = decoded.correo; // Añadir el correo del usuario al `req`
        next();
    });
};

