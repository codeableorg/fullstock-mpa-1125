export async function globalDataMiddleware(req, res, next) {
  const db = await readDb();
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
    writeDb(db);
    res.cookie("cartId", cart.id);
  } else {
    cart = db.carts.find((cart) => cart.id === cartId);

    if (!cart) {
      cart = emptyCart;
      db.carts.push(cart);
      writeDb(db);
      res.cookie("cartId", cart.id);
    }
  }

  res.locals.cart = cart;
  next();
}
