import { Router } from "express";
import rutaAdmin from "./routes.admin";
import userRout from "./userrout.js";
import { actualizarLongitudContrasena } from "../controllers/configuracionController.js"; // Importa el controlador

const ruta = Router();

ruta.use('/users', userRout);

ruta.use("/", (req, res) => {
    res.json({ message: 'hola mundo' });
});

ruta.use("/", rutaAdmin);

ruta.put('/configuracion/longitud-contrasena', actualizarLongitudContrasena);

export default ruta;
