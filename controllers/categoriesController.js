import { readDb } from "../data/db.js";

export async function renderCategory(req, res, next) {
  const db = await readDb();

  const categorySlug = req.params.categorySlug;

  // Obtener la categoría desde la base de datos
  const category = db.categories.find(
    (category) => category.slug === categorySlug
  );

  if (!category) {
    return next();
  }

  // Obtener los productos de la categoría
  const products = db.products.filter(
    (product) => product.categoryId === category.id
  );

  res.render("category", {
    category,
    products,
  });
}
