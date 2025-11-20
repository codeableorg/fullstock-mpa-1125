import express from "express";
import cookiesMiddleware from "cookie-parser";
import layoutMiddleware from "express-ejs-layouts";

import { db } from "./data/db.js";

function globalDataMiddleware(req, res, next) {
  res.locals.categories = db.categories;

  const cartId = Number(req.cookies.cartId);

  const emptyCart = {
    id: Math.random() * 10 ** 17,
    total: 0,
    totalQuantity: 0,
    items: [],
  };

  let cart;

  if (!cartId) {
    cart = emptyCart;

    db.carts.push(cart);
    res.cookie("cartId", cart.id);
  } else {
    cart = db.carts.find((cart) => cart.id === cartId);

    if (!cart) {
      cart = emptyCart;
      res.cookie("cartId", cart.id);
    }
  }

  res.locals.cart = cart;
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

// Middleware para parsear las cookies y almacenarlo en req.cookies
app.use(cookiesMiddleware());

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

app.post("/cart/add", (req, res) => {
  const productId = Number(req.body.productId);

  const product = db.products.find((product) => product.id === productId);

  // El producto esta en carrito?
  const cartItem = res.locals.cart.items.find(
    (item) => item.product.id === product.id
  );

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
    res.locals.cart.items.push(newItem);
  }

  res.locals.cart.total += product.price;
  res.locals.cart.totalQuantity += 1;

  // res.redirect("/products/" + product.id);

  // Redirigir a la URL que nos hizo la petición
  res.redirect(req.get("Referer"));
});

app.post("/cart/delete-item", (req, res) => {
  const productId = Number(req.body.productId);

  const cart = res.locals.cart;

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

  const cart = res.locals.cart;

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
  const orderId = req.query.orderId;
  res.render("order-confirmation", { orderId });
});

app.post("/orders/create", (req, res) => {
  const { email, ...shippingInfo } = req.body;

  const cart = res.locals.cart;

  const newOrder = {
    id: Math.random() * 10 ** 17,
    email,
    orderDetails: cart,
    shippingInfo,
  };

  db.orders.push(newOrder);

  cart.total = 0;
  cart.totalQuantity = 0;
  cart.items = [];

  res.redirect("/order-confirmation?orderId=" + newOrder.id);
});

// EJEMPLO PARA COOKIE:
app.get("/set-cookie", (req, res) => {
  res.cookie("test", "123");

  res.send("<p>Cookie seteada<p>");
});

app.get("/get-cookie", (req, res) => {
  // Leer la cookie
  const cookies = req.cookies;

  // Responder al cliente con la cookie en HTML
  res.send(`<p>Cookies: ${JSON.stringify(cookies)}<p>`);
});

// Manejador de rutas no encontradas
app.use(notFoundMiddleware);

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
