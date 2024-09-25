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

export const GETpermisos = async (req, res) => {
  try {
    const respuesta = await basedatos.query(
      "CALL SP_LISTAR_PERMISOS();"
    );
    success(req, res, 200, respuesta[0][0]);
  } catch (err) {
    error(req, res, 200, err || "Error interno del servidor");
  }
};

export const ActualizarEstado = async (req, res) => {
  const { id, idPermiso, estado } = req.body;
  console.log(id);
  console.log(idPermiso);
  console.log(estado);

  if (!id || !idPermiso || !estado) {
    return res.status(400).json({ success: false, message: "Faltan campos requeridos." });
  }

  if (estado !== 'activo' && estado !== 'inactivo') {
    return res.status(400).json({ success: false, message: "Estado inválido. Debe ser 'activo' o 'inactivo'." });
  }

  try {
    const [result] = await basedatos.query("CALL	SP_ACTUALIZAR_PERMISO_ESTADO(?, ?, ?)", [id, idPermiso, estado]);

    if (result.affectedRows > 0) {
      res.json({ success: true, message: "Permiso actualizado correctamente" });
    } else {
      res.json({ success: false, message: "No se encontró el permiso o no se actualizó" });
    }
  } catch (error) {
    console.error("Error al cambiar el estado del permiso:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};




  
