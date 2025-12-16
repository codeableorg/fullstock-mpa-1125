import * as cartsService from "../services/cartsService.js";
import * as categoriesService from "../services/categoriesService.js";
import { formatPrice } from "../utils.js";

export async function globalDataMiddleware(req, res, next) {
  const cartId = Number(req.cookies.cartId);

  const cart = await cartsService.getOrCreateCart(cartId);
  res.cookie("cartId", cart.id);

  const categories = await categoriesService.getCategories();

  res.locals.cart = cart;
  res.locals.categories = categories;
  res.locals.formatPrice = formatPrice;
  next();
}
