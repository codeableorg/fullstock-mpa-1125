import express from "express";

import * as categoriesController from "./controllers/categoriesController.js";
import * as cartsController from "./controllers/cartsController.js";
import * as homeController from "./controllers/homeController.js";
import * as productsController from "./controllers/productsController.js";
import * as ordersController from "./controllers/ordersController.js";

const router = express.Router();

// Home
router.get("/", homeController.renderHome);

// Categories
router.get("/:categorySlug", categoriesController.renderCategory);

// Products
router.get("/products/:id", productsController.renderProduct);

// Carts
router.get("/cart", cartsController.renderCart);
router.post("/cart/add", cartsController.addCartItem);
router.post("/cart/delete-item", cartsController.deleteCartItem);
router.post("/cart/update-item", cartsController.updateCartItem);

// Orders
router.get("/checkout", ordersController.renderCheckout);
router.get("/order-confirmation", ordersController.renderOrderConfirmation);
router.post("/orders/create", ordersController.createOrder);

export default router;
