import { basedatos } from "../config/mysql.db";
import { error, success } from "../messages/browser";

// Función auxiliar para manejar errores
const handleError = (req, res, err) => {
  console.error('Error en la operación de base de datos:', err);
  return error(req, res, 500, 'Error interno del servidor');
};

export const obtenerActividadesSospechosas = async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;
  if (!fecha_inicio || !fecha_fin) {
    return error(req, res, 400, 'Se requieren fecha_inicio y fecha_fin');
  }
  try {
    const results = await basedatos.query('CALL contarActividadesPorDia(?, ?)', [fecha_inicio, fecha_fin]);
    success(req, res, 200, results[0][0]);
  } catch (err) {
    handleError(req, res, err);
  }
};

export const contarActividadesPorDia = async (req, res) => {
  const { fecha_inicio, fecha_fin } = req.query;
  if (!fecha_inicio || !fecha_fin) {
    return error(req, res, 400, 'Se requieren fecha_inicio y fecha_fin');
  }
  try {
    const results = await basedatos.query('CALL contarActividadesPorDia(?, ?)', [fecha_inicio, fecha_fin]);
    success(req, res, 200, results[0][0]);
  } catch (err) {
    handleError(req, res, err);
  }
};

export const obtenerEstadoCertificados = async (req, res) => {
  try {
    const results = await basedatos.query('CALL obtenerEstadoCertificados()');
    success(req, res, 200, results[0][0]);
  } catch (err) {
    handleError(req, res, err);
  }
};

export const contarCertificadosPorEstado = async (req, res) => {
  try {
    const results = await basedatos.query('CALL contarCertificadosPorEstado()');
    success(req, res, 200, results[0][0]);
  } catch (err) {
    handleError(req, res, err);
  }
};

export const obtenerAdministradoresActivos = async (req, res) => {
  try {
    const results = await basedatos.query('CALL obtenerAdministradoresActivos()');
    success(req, res, 200, results[0][0]);
  } catch (err) {
    handleError(req, res, err);
  }
};

export const contarAdministradoresPorEstado = async (req, res) => {
  try {
    const results = await basedatos.query('CALL contarAdministradoresPorEstado()');
    success(req, res, 200, results[0][0]);
  } catch (err) {
    handleError(req, res, err);
  }
};

export const obtenerPoliticasBloqueo = async (req, res) => {
  try {
    const results = await basedatos.query('CALL obtenerPoliticasBloqueo()');
    success(req, res, 200, results[0][0][0]); // Devuelve solo el primer resultado ya que es una política única
  } catch (err) {
    handleError(req, res, err);
  }
};
