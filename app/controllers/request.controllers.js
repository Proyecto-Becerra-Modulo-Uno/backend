import { basedatos } from "../config/mysql.db.js";
import { error, success } from "../messages/browser.js";

export const getRequest = async (req, res) => {
    try {
        const [request] = await basedatos.query("CALL SP_GET_SOLI();");
        success(req, res, 200, request[0]);
    } catch (err) {
        error(req, res, 500, err);
    }
};

export const getRequestId = async (req, res) => {
    const {id} = req.params;
    try {
        const request = await basedatos.query("CALL SP_GET_SOLI_ID(?)", [id]);
        success(req, res, 200, request[0][0]);
    } catch (err) {
        error(req, res, 404, err);
    }
}

export const updateRequest = async (req, res) => {
    const {id_soli, id_estado} = req.body;
    try {
        const [request] = await basedatos.query("CALL SP_UPDATE_SOLI(?, ?);", [id_soli, id_estado]);
        success(req, res, 201, "Solicitud Actualizada");
    } catch (err) {
        error(req, res, 500, err);
    }
};
export const createRequest = async(req, res) => {
    const {id_usuario, id_tipo} = req.body;
    try {
        const request = await basedatos.query("CALL SP_POST_REQUEST(?,?)", [id_usuario, id_tipo]);
        success(req, res, 200, "Creado");
    } catch (err) {
        error(req, res, 500, err)
    }
}
