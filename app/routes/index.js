import { Router } from "express";
import { validatePassword } from "../controllers/controllers.js";
import rutaAdmin from "./routes.admin";
import userRout from "./userrout.js";

const ruta = Router();

// Ruta para validar la contraseña
ruta.post('/validate-password', validatePassword);

ruta.use('/users',userRout);

ruta.use("/", (req, res) =>{
    res.json({message:'hola mundo'})
});

ruta.use("/", rutaAdmin);

export default ruta;