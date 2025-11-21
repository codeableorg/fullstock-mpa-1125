import { readDb, writeDb } from "../data/db.js";

export function renderCart(req, res) {
  res.render("cart");
}

export async function addCartItem(req, res) {
  const db = await readDb();
  const cartId = res.locals.cart.id;
  const cart = db.carts.find((cart) => cart.id === cartId);

  const productId = Number(req.body.productId);

  const product = db.products.find((product) => product.id === productId);

  // El producto esta en carrito?
  const cartItem = cart.items.find((item) => item.product.id === product.id);

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
    cart.items.push(newItem);
  }

  cart.total += product.price;
  cart.totalQuantity += 1;

  await writeDb(db);

  // res.redirect("/products/" + product.id);

  // Redirigir a la URL que nos hizo la petición
  res.redirect(req.get("Referer"));
}

export async function deleteCartItem(req, res) {
  const db = await readDb();
  const cartId = res.locals.cart.id;
  const cart = db.carts.find((cart) => cart.id === cartId);

  const productId = Number(req.body.productId);

  const index = cart.items.findIndex((item) => item.product.id === productId);
  const item = cart.items[index];

  cart.total -= item.subtotal;
  cart.totalQuantity -= item.quantity;

  cart.items.splice(index, 1);

  await writeDb(db);

  res.redirect("/cart");
}

export async function updateCartItem(req, res) {
  const db = await readDb();
  const cartId = res.locals.cart.id;
  const cart = db.carts.find((cart) => cart.id === cartId);

  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity);

  const item = cart.items.find((item) => item.product.id === productId);

  const deltaQuantity = quantity - item.quantity;
  const deltaSubTotal = deltaQuantity * item.product.price;

  item.quantity += deltaQuantity;
  item.subtotal += deltaSubTotal;

  cart.totalQuantity += deltaQuantity;
  cart.total += deltaSubTotal;

  writeDb(db);

  res.redirect("/cart");
}
