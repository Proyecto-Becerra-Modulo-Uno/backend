import { Router } from "express";
import userRout from "./routes.user.js";
import rutaAdmin from "./routes.admin.js";

const ruta = Router();

ruta.use('/',userRout);
ruta.use("/", rutaAdmin);

export default ruta;
