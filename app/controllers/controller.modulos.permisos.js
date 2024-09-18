import express from "express";
import { error, success } from "../messages/browr.js";
import { basedatos } from "../config/mysql.db.js";

export const GETModulosYpermisos = async (req, res) => {
  try {
    const respuesta = await basedatos.query(
      "CALL SP_OBTENER_MODULOS_Y_PERMISOS();"
    );
    success(req, res, 200, respuesta[0][0]);
  } catch (err) {
    error(req, res, 200, err || "Error interno del servidor");
  }
};

export const ActualizarEstado = async (req, res) => {
    const { modulo, idPermiso, estado } = req.body; 
    try {
        await basedatos.query("CALL ACTUALIZAR_ESTADO(?, ?, ?)", [modulo, idPermiso, estado]);

        res.json({ success: true, message: "Permiso actualizado correctamente" });
    } catch (error) {
        console.error("Error al cambiar el estado del permiso:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

  
