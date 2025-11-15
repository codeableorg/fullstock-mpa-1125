import express from "express";
import layoutMiddleware from "express-ejs-layouts";

import { db } from "./data/db.js";

function globalDataMiddleware(req, res, next) {
  res.locals.categories = db.categories;
  res.locals.cart = db.cart;
  next();
}

function notFoundMiddleware(req, res) {
  res.status(404).render("404");
}

const app = express();

// Middleware para servir archivos estáticos
app.use(express.static("public"));

// Configura EJS como motor de plantillas
app.set("view engine", "ejs");
app.use(layoutMiddleware);

// Middleware de datos globales
app.use(globalDataMiddleware);

// Rutas
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/polos", (req, res) => {
  // Obtener la categoría de polos desde la base de datos
  const category = db.categories.find((category) => category.slug === "polos");

  // Obtener los productos de la categoría de polos
  const products = db.products.filter(
    (product) => product.categoryId === category.id
  );

  res.render("category", {
    category,
    products,
  });
});

app.get("/tazas", (req, res) => {
  // Obtener la categoría de tazas desde la base de datos
  const category = db.categories.find((category) => category.slug === "tazas");

  // Obtener los productos de la categoría de tazas
  const products = db.products.filter(
    (product) => product.categoryId === category.id
  );

  res.render("category", {
    category,
    products,
  });
});

app.get("/stickers", (req, res) => {
  // Obtener la categoría de stickers desde la base de datos
  const category = db.categories.find(
    (category) => category.slug === "stickers"
  );

  // Obtener los productos de la categoría de stickers
  const products = db.products.filter(
    (product) => product.categoryId === category.id
  );

  res.render("category", {
    category,
    products,
  });
});

app.get("/products/:id", (req, res) => {
  // Convertir el id del producto a número
  const id = Number(req.params.id);
  // Buscar el producto por su id
  const product = db.products.find((product) => product.id === id);

  res.render("product", { product });
});

app.get("/cart", (req, res) => {
  res.render("cart");
});

app.get("/checkout", (req, res) => {
  res.render("checkout");
});

app.get("/order-confirmation", (req, res) => {
  res.render("order-confirmation");
});

// Manejador de rutas no encontradas
app.use(notFoundMiddleware);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
