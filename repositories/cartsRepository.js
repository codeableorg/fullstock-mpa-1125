import { getNextId, readDb, writeDb } from "../db/index.js";

export async function findById(id) {
  const db = await readDb();

  const cart = db.carts.find((cart) => cart.id === id);

  return cart;
}

export async function updateCart(newCart) {
  const db = await readDb();

  const index = db.carts.findIndex((cart) => cart.id === newCart.id);

  db.carts[index] = newCart;

  writeDb(db);
}

export async function createCart() {
  const db = await readDb();

  const newCart = {
    id: getNextId("carts"),
    total: 0,
    totalQuantity: 0,
    items: [],
  };

  db.carts.push(newCart);

  await writeDb(db);

  return newCart;
}
