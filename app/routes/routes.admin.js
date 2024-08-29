import {Router} from "express";
import { verifyToken } from "../middlewares/oauth.js";

const rutaAdmin = Router();

rutaAdmin.get("/", ()=>{
    
})

rutaAdmin.get("/token", verifyToken)

export default rutaAdmin;