import { readDb, writeDb } from "../data/db.js";

export function renderCheckout(req, res) {
  res.render("checkout");
}

export function renderOrderConfirmation(req, res) {
  const orderId = req.query.orderId;

  // verificar que la orden existe

  res.render("order-confirmation", { orderId });
}

export async function createOrder(req, res) {
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
}
