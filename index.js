import express from "express";
import cookiesMiddleware from "cookie-parser";
import layoutMiddleware from "express-ejs-layouts";

import { globalDataMiddleware } from "./middlewares/globalDataMiddleware.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";
import router from "./routes.js";

const app = express();

// Middleware para servir archivos estáticos
app.use(express.static("public"));

// Middleware para procesar la data de formularios y almacenarlo en req.body
app.use(express.urlencoded());

// Middleware para parsear las cookies y almacenarlo en req.cookies
app.use(cookiesMiddleware());

// Configura EJS como motor de plantillas
app.set("view engine", "ejs");
app.use(layoutMiddleware);

// Middleware de datos globales
app.use(globalDataMiddleware);

// Rutas
app.use(router);

// Manejador de rutas no encontradas
app.use(notFoundMiddleware);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
