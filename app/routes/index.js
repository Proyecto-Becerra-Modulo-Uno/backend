import { Router } from "express";
import userRout from "./routes.user.js";
import rutaAdmin from "./routes.admin.js";
import authRoutes from "./auth.routes.js";

const ruta = Router();


ruta.use('/users', userRout);

ruta.use('/auth', authRoutes);

ruta.use("/admin", rutaAdmin);

ruta.use("/", (req, res) => {
    res.json({ message: 'hola mundo' });
});

export default ruta;
