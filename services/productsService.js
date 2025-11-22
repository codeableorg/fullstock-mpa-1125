import * as productsRepository from "../repositories/productsRepository.js";

export async function getProductsByCategoryId(id) {
  const products = await productsRepository.findByCategoryId(id);

  return products;
}

export async function getProductById(id) {
  const product = await productsRepository.findById(id);

  return product;
}
