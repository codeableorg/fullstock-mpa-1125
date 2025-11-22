import * as productsService from "../services/productsService.js";

export async function renderProduct(req, res) {
  // Obtiene id de producto de los parametros de ruta y lo convierte a number
  const id = Number(req.params.id);

  // Buscar el producto por su id
  const product = await productsService.getProductById(id);

  res.render("product", { product });
}
