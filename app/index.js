import app from "./app.js";

app.listen(app.get("port"), () =>{
    console.log(`Ejecutandose en: http://localhost:${app.get("port")}`)
})