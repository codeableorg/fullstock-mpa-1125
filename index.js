import express from "express";
import cookiesMiddleware from "cookie-parser";
import layoutMiddleware from "express-ejs-layouts";

import { readDb, writeDb } from "./data/db.js";
import { globalDataMiddleware } from "./middlewares/globalDataMiddleware.js";
import { notFoundMiddleware } from "./middlewares/notFoundMiddleware.js";
import * as cartsController from "./controllers/cartsController.js";
import * as productsController from "./controllers/productsController.js";

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
app.get("/", (req, res) => {
  res.render("home");
});

// Categories
app.get("/:categorySlug", async (req, res, next) => {
  const db = await readDb();

  const categorySlug = req.params.categorySlug;

  // Obtener la categoría desde la base de datos
  const category = db.categories.find(
    (category) => category.slug === categorySlug
  );

  if (!category) {
    return next();
  }

  // Obtener los productos de la categoría
  const products = db.products.filter(
    (product) => product.categoryId === category.id
  );

  res.render("category", {
    category,
    products,
  });
});

// Products
app.get("/products/:id", productsController.renderProduct);

// Carts
app.get("/cart", cartsController.renderCart);
app.post("/cart/add", cartsController.addCartItem);
app.post("/cart/delete-item", cartsController.deleteCartItem);
app.post("/cart/update-item", cartsController.updateCartItem);

// Orders
app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.get("/order-confirmation", (req, res) => {
  const orderId = req.query.orderId;

  // verificar que la orden existe

  res.render("order-confirmation", { orderId });
});

app.post("/orders/create", async (req, res) => {
  const db = await readDb();
  const cartId = res.locals.cart.id;
  const cart = db.carts.find((cart) => cart.id === cartId);

  const { email, ...shippingInfo } = req.body;

  const newOrder = {
    id: Math.random() * 10 ** 17,
    email,
    orderDetails: cart,
    shippingInfo,
  };

  db.orders.push(newOrder);
  await writeDb(db);

  res.cookie("cartId", undefined, { maxAge: 0 });

  res.redirect("/order-confirmation?orderId=" + newOrder.id);
});

// Manejador de rutas no encontradas
app.use(notFoundMiddleware);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
