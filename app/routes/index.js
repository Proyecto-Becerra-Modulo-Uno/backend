import Router from "express";
import userRout from "./userrout.js";

const ruta = Router();

ruta.use('/users',userRout);

ruta.use("/", (req, res) =>{
    res.json({message:'hola mundo'})
});


export default ruta