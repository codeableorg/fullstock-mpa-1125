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

// Middleware para procesar la data de formularios y almacenarlo en req.body
app.use(express.urlencoded());

// Configura EJS como motor de plantillas
app.set("view engine", "ejs");
app.use(layoutMiddleware);

// Middleware de datos globales
app.use(globalDataMiddleware);

// Rutas
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/:categorySlug", (req, res, next) => {
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

app.get("/products/:id", (req, res) => {
  // Convertir el id del producto a número
  const id = Number(req.params.id);
  // Buscar el producto por su id
  const product = db.products.find((product) => product.id === id);

  res.render("product", { product });
});

app.post("/cart/add", (req, res, next) => {
  const productId = Number(req.body.productId);

  const product = db.products.find((product) => product.id === productId);

  // El producto esta en carrito?
  const cartItem = db.cart.items.find((item) => item.product.id === product.id);

  // Si sí está, añadir 1 a la cantidad actual
  if (cartItem) {
    cartItem.quantity += 1;
    cartItem.subtotal += product.price;
  } else {
    // Si no está, crear y añadir el Item para este producto
    const newItem = {
      product: {
        id: product.id,
        title: product.title,
        imgSrc: product.imgSrc,
        price: product.price,
      },
      quantity: 1,
      subtotal: product.price,
    };
    db.cart.items.push(newItem);
  }

  db.cart.total += product.price;
  db.cart.totalQuantity += 1;

  // res.redirect("/products/" + product.id);

  // Redirigir a la URL que nos hizo la petición
  res.redirect(req.get("Referer"));
});

app.post("/cart/delete-item", (req, res) => {
  const productId = Number(req.body.productId);

  const cart = db.cart;

  const index = cart.items.findIndex((item) => item.product.id === productId);
  const item = cart.items[index];

  cart.total -= item.subtotal;
  cart.totalQuantity -= item.quantity;

  cart.items.splice(index, 1);

  res.redirect("/cart");
});

app.post("/cart/update-item", (req, res) => {
  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity);

  const cart = db.cart;

  const item = cart.items.find((item) => item.product.id === productId);

  const deltaQuantity = quantity - item.quantity;
  const deltaSubTotal = deltaQuantity * item.product.price;

  item.quantity += deltaQuantity;
  item.subtotal += deltaSubTotal;

  cart.totalQuantity += deltaQuantity;
  cart.total += deltaSubTotal;

  res.redirect("/cart");
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
