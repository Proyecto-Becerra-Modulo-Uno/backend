import express from "express";
import logger from "./logger.js";
import cors from "cors";
import { config } from "dotenv";
import ruta from "./routes/index.js";
import sessionConfig from "./middlewares/oauth.js";
import { checkIPBlacklist, toggleIPPrinting } from "./middlewares/checkIPBlacklist.js";


config();


const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(checkIPBlacklist);

// Desactiva la impresión de IP después de un tiempo (por ejemplo, 5 minutos)...

setTimeout(() => {
  toggleIPPrinting(true);
}, 5 * 60 * 1000);

app.set("port", process.env.PORT || 6000);

app.use(cors());

app.use(sessionConfig);

app.use("/", ruta);

app.get('/', (req, res) => {
    logger.info('Solicitud recibida en la ruta raíz');
    res.send('Ejecución de backend');
  });

export default app;