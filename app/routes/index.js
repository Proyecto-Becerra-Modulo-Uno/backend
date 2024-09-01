import { Router } from "express";
import rutaAdmin from "./routes.admin";
// import { actualizarLongitudContrasena } from "../controllers/configuracionController.js"; // Importa el controlador
import userRout from "./routes.user.js";

const ruta = Router();

ruta.use('/users', userRout);

ruta.use("/", (req, res) => {
    res.json({ message: 'hola mundo' });
});

ruta.use("/", rutaAdmin);

// ruta.put('/configuracion/longitud-contrasena', actualizarLongitudContrasena);

export default ruta;
