import express from "express";
import logger from "./logger.js";
import cors from "cors";
import { config } from "dotenv";
import ruta from "./routes/index.js";
config();

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 6000);

app.use(cors());

app.use("/", ruta);

app.get('/', (req, res) => {
    logger.info('Solicitud recibida en la ruta raíz');
    res.send('Hola Mundo');
  });

export default app;
