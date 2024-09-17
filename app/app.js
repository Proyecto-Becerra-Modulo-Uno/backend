import express from "express";
import cors from "cors";
import { config } from "dotenv";
import ruta from "./routes/index.js";
import sessionConfig from "./middlewares/oauth.js";

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("port", process.env.PORT || 6000);

app.use(cors());

app.use(sessionConfig);

app.use("/", ruta);


export default app;
