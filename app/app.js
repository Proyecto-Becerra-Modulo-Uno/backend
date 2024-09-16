import express from "express";
import cors from "cors";
import { config } from "dotenv";
import ruta from "./routes/index.js";
import { checkIPBlacklist, toggleIPPrinting } from "./middlewares/checkIPBlacklist.js";

config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(checkIPBlacklist);
setTimeout(() => {
  toggleIPPrinting(true);
}, 5 * 60 * 1000);

app.set("port", process.env.PORT || 6000);

app.use(cors());

app.use("/", ruta);

export default app;
