import bcrypt from "bcrypt";
import { basedatos } from "../config/mysql.db.js";
import jwt from "jsonwebtoken";
import { error, success } from "../messages/browser.js";

export const crearGrupo = async(req, res) => {
    const {nombre, desc} = req.body;
    try {
        const request = await basedatos.query("CALL SP_INSERTAR_GRUPO(?, ?)", [nombre, desc]);
        success(req, res, 201, "Grupo creado")
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error creando grupo");
    }
}

export const addParticipantes = async (req, res) => {
    const { correo, grupo } = req.body;
    try {
        const request = await basedatos.query("CALL SP_ADD_INTEGRANTE(?, ?)", [correo, grupo]);
        success(req, res, 201, "Integrante añadido correctamente");
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error añadiendo integrante");
    }
}

export const obtenerGrupo = async(req, res) => {
    try {
        const request = await basedatos.query("CALL SP_OBTENER_ÚLTIMO_GRUPO()");
        success(req, res, 201, request[0][0])
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error creando grupo");
    }
}

export const listar_grupos = async(req, res) => {
    try {
        const request = await basedatos.query("CALL SP_LISTAR_GRUPOS");
        success(req, res, 201, request[0][0]);
    } catch (err) {
        console.error(err);
        error(req, res, 500, "Error listando grupos");
    }
}