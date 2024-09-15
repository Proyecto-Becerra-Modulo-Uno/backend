import {Router} from "express";
import { verifyToken } from "../middlewares/oauth.js";
import { exportDatabase } from "../controllers/exportdbController.js";
import { generateCSR, getAllCertificates, renewCertificate } from "../controllers/certificateController.js";

const rutaAdmin = Router();

rutaAdmin.get("/token", verifyToken);
rutaAdmin.get('/export-database', exportDatabase);
rutaAdmin.get('/certificates', getAllCertificates);
rutaAdmin.post('/certificates/renew/:id', renewCertificate);


export default rutaAdmin;
