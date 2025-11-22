import * as ordersService from "../services/ordersService.js";

export function renderCheckout(req, res) {
  res.render("checkout");
}

export function renderOrderConfirmation(req, res) {
  const orderId = req.query.orderId;

  // verificar que la orden existe

  res.render("order-confirmation", { orderId });
}

export async function createOrder(req, res) {
  const cartId = Number(req.cookies.cartId);
  const { email, ...shippingInfo } = req.body;

  const order = await ordersService.createOrder(cartId, email, shippingInfo);

  res.cookie("cartId", undefined, { maxAge: 0 });

  res.redirect("/order-confirmation?orderId=" + order.id);
}
