import { Router } from "express";
// import { actualizarLongitudContrasena } from "../controllers/configuracionController.js"; // Importa el controlador
import userRout from "./routes.user.js";
import rutaAdmin from "./routes.admin.js";
import authRoutes from "./auth.routes.js";

const ruta = Router();


ruta.use("/", rutaAdmin);
ruta.use('/users', userRout);
ruta.use('/auth', authRoutes);


// ruta.put('/configuracion/longitud-contrasena', actualizarLongitudContrasena);

export default ruta;
