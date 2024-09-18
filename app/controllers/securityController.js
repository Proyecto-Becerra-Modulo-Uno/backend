import { basedatos } from "../config/mysql.db";
import { error, success } from "../messages/browr";

export const obtenerActividadesSospechosas = (req, res) => {
    basedatos.query('CALL obtenerActividadesSospechosas()', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results[0]);
    });
};

export const contarActividadesPorDia = (req, res) => {
    basedatos.query('CALL contarActividadesPorDia()', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results[0]);
    });
};

export const obtenerEstadoCertificados = (req, res) => {
    basedatos.query('CALL obtenerEstadoCertificados()', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results[0]);
    });
};

export const contarCertificadosPorEstado = (req, res) => {
    basedatos.query('CALL contarCertificadosPorEstado()', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results[0]);
    });
};

export const obtenerAdministradoresActivos = (req, res) => {
    basedatos.query('CALL obtenerAdministradoresActivos()', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results[0]);
    });
};

export const contarAdministradoresPorEstado = (req, res) => {
    basedatos.query('CALL contarAdministradoresPorEstado()', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results[0]);
    });
};

export const obtenerPoliticasBloqueo = (req, res) => {
    basedatos.query('CALL obtenerPoliticasBloqueo()', (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      res.json(results[0]);
    });
};