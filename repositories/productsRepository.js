import { readDb } from "../data/db.js";

export async function findByCategoryId(id) {
  const db = await readDb();

  const products = db.products.filter((product) => product.categoryId === id);

  return products;
}

export async function findById(id) {
  const db = await readDb();

  const product = db.products.find((product) => product.id === id);

  return product;
}
