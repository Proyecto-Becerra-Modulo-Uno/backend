import {Router} from "express";
import { verifyToken } from "../middlewares/oauth.js";
import { exportDatabase } from "../controllers/exportdbController.js";

const rutaAdmin = Router();

rutaAdmin.get("/token", verifyToken)
rutaAdmin.get('/export-database', exportDatabase);


export default rutaAdmin;