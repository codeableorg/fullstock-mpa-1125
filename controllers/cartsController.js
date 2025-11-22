import { readDb, writeDb } from "../data/db.js";
import * as cartsService from "../services/cartsService.js";

export function renderCart(req, res) {
  res.render("cart");
}

export async function addCartItem(req, res) {
  // Obtiene el cartId desde cookies
  const cartId = Number(req.cookies.cartId);
  // Obtiene el productId enviado por el cliente
  const productId = Number(req.body.productId);

  await cartsService.addItemToCart(cartId, productId);

  // res.redirect("/products/" + product.id);

  // Redirigir a la URL que nos hizo la petición
  res.redirect(req.get("Referer"));
}

export async function deleteCartItem(req, res) {
  const cartId = Number(req.cookies.cartId);
  const productId = Number(req.body.productId);

  await cartsService.deleteItemFromCart(cartId, productId);

  res.redirect("/cart");
}

export async function updateCartItem(req, res) {
  const cartId = Number(req.cookies.cartId);
  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity);

  await cartsService.updateItemFromCart(cartId, productId, quantity);

  res.redirect("/cart");
}
