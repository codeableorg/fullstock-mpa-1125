import express from "express";
import cookiesMiddleware from "cookie-parser";
import layoutMiddleware from "express-ejs-layouts";

import { globalDataMiddleware } from "./middlewares/globalDataMiddleware.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";

import * as homeController from "./controllers/homeController.js";
import * as categoriesController from "./controllers/categoriesController.js";
import * as productsController from "./controllers/productsController.js";
import * as cartsController from "./controllers/cartsController.js";
import * as ordersController from "./controllers/ordersController.js";

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

// Home
app.get("/", homeController.renderHome);

// Categories
app.get("/:categorySlug", categoriesController.renderCategory);

// Products
app.get("/products/:id", productsController.renderProduct);

// Carts
app.get("/cart", cartsController.renderCart);
app.post("/cart/add", cartsController.addCartItem);
app.post("/cart/delete-item", cartsController.deleteCartItem);
app.post("/cart/update-item", cartsController.updateCartItem);

// Orders
app.get("/checkout", ordersController.renderCheckout);
app.get("/order-confirmation", ordersController.renderOrderConfirmation);
app.post("/orders/create", ordersController.createOrder);

// Manejador de rutas no encontradas
app.use(notFoundMiddleware);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
