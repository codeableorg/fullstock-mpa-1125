import * as cartsService from "../services/cartsService.js";
import * as categoriesService from "../services/categoriesService.js";

export async function globalDataMiddleware(req, res, next) {
  const cartId = Number(req.cookies.cartId);

  const cart = await cartsService.getOrCreateCart(cartId);
  const categories = await categoriesService.getCategories();

  res.locals.cart = cart;
  res.locals.categories = categories;
  next();
}
