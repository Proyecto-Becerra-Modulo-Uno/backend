import { Router } from "express";
// import { actualizarLongitudContrasena } from "../controllers/configuracionController.js"; // Importa el controlador
import userRout from "./routes.user.js";
import rutaAdmin from "./routes.admin.js";
import authRoutes from "./auth.routes.js";

const ruta = Router();

ruta.use('/users', userRout);

// ruta.use("/", (req, res) => {
//     res.json({ message: 'hola mundo' });
// });

ruta.use('/auth', authRoutes);

ruta.use("/", (req, res) => {
    res.json({ message: 'hola mundo' });
});


ruta.use("/", rutaAdmin);
ruta.use('/users',userRout);
ruta.use("/", rutaAdmin);
ruta.use("/", (req, res) =>{
    res.json({message:'hola mundo'})
});




// ruta.put('/configuracion/longitud-contrasena', actualizarLongitudContrasena);

export default ruta;
