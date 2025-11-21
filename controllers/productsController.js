export async function renderProduct(req, res) {
  const db = await readDb();
  // Convertir el id del producto a número
  const id = Number(req.params.id);
  // Buscar el producto por su id
  const product = db.products.find((product) => product.id === id);

  res.render("product", { product });
}
