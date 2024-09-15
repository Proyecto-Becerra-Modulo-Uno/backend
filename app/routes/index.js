import { Router } from "express";
import userRout from "./routes.user.js";
import rutaAdmin from "./routes.admin.js";
import authRoutes from "./auth.routes.js";

const ruta = Router();


ruta.use("/", rutaAdmin);
ruta.use('/users', userRout);
ruta.use('/auth', authRoutes);


export default ruta;
