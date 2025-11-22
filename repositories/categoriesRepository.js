import { readDb } from "../data/db.js";

export async function findBySlug(slug) {
  const db = await readDb();

  const category = db.categories.find((category) => category.slug === slug);

  return category;
}

export async function findAll() {
  const db = await readDb();

  return db.categories;
}
