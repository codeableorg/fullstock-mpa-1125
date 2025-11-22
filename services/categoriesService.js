import * as categoriesRepository from "../repositories/categoriesRepository.js";

export async function getCategoryBySlug(slug) {
  const validSlugs = ["polos", "tazas", "stickers"];

  if (!validSlugs.includes(slug)) return undefined;

  const category = await categoriesRepository.findBySlug(slug);

  return category;
}

export async function getCategories() {
  const categories = await categoriesRepository.findAll();

  return categories;
}
