import * as categoriesService from "../services/categoriesService.js";
import * as productsService from "../services/productsService.js";

export async function renderCategory(req, res, next) {
  // Leyendo el categorySlug desde los parametros de ruta
  const categorySlug = req.params.categorySlug;

  // Obtener la categoría por el slug
  const category = await categoriesService.getCategoryBySlug(categorySlug);

  if (!category) {
    return next();
  }

  // Obtener los productos de la categoría
  const products = await productsService.getProductsByCategoryId(category.id);

  res.render("category", {
    category,
    products,
  });
}
