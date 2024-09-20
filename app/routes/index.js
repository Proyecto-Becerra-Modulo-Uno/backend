import { Router } from "express";
import userRout from "./routes.user.js";
import rutaAdmin from "./routes.admin.js";
import authRoutes from "./auth.routes.js";
import { getLogs } from "../controllers/userController.js";

const ruta = Router();

ruta.use("/", rutaAdmin);

ruta.use('/users', userRout);
ruta.use('/logs-prueba', getLogs)

// ruta.use("/", (req, res) => {
//     res.json({ message: 'hola mundo' });
// });

ruta.use('/auth', authRoutes);

ruta.use("/admin", rutaAdmin);

ruta.use("/", (req, res) => {
    res.json({ message: 'hola mundo' });
});



ruta.use("/", rutaAdmin);
ruta.use('/users',userRout);
ruta.use("/", rutaAdmin);
ruta.use("/", (req, res) =>{
    res.json({message:'hola mundo'})
});




export default ruta;
