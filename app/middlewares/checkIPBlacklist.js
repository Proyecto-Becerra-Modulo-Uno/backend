import { basedatos } from "../config/mysql.db.js";
import { error, success } from "../messages/browr.js";


const getClientIP = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    // Si hay una cabecera X-Forwarded-For, toma la primera IP (la del cliente original)
    return forwardedFor.split(',')[0].trim();
  }

  // Si no hay X-Forwarded-For, usa la IP remota
  return req.connection.remoteAddress;
};

export const checkIPBlacklist = async (req, res, next) => {
  const clientIP = getClientIP(req);  // Obtiene la IP del cliente

  try {
    const [rows] = await basedatos.execute('CALL CheckIPBlacklist(?, @is_blacklisted)', [clientIP]);
    const [[result]] = await basedatos.execute('SELECT @is_blacklisted AS isBlacklisted');

    if (result.isBlacklisted) {
      // La IP está en la lista negra
      return error(req, res, 403, "Acceso denegado: IP en lista negra");
    }

    // La IP no está en la lista negra, continúa con la siguiente función middleware
    next();
  } catch (e) {
    console.error('Error al verificar la lista negra de IP:', e);
    error(req, res, 500, "Error interno del servidor");
  }
};

export const toggleIPPrinting = (enable) => {
  DEBUG_PRINT_IP = enable;
  console.log(`Impresión de IP ${enable ? 'activada' : 'desactivada'}`);
};
