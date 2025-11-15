import express from "express";
import layoutMiddleware from "express-ejs-layouts";

const app = express();

// Middleware para servir archivos estáticos
app.use(express.static("public"));

// Configura EJS como motor de plantillas
app.set("view engine", "ejs");
app.use(layoutMiddleware);

// Rutas
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/category", (req, res) => {
  res.render("category");
});

app.get("/product", (req, res) => {
  res.render("product");
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
app.use((req, res) => {
  res.status(404).render("404");
});

app.listen(3000, () => {
  console.log(`Server is running on http://localhost:3000`);
});
