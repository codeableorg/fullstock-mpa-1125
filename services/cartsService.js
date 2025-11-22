import * as cartsRepository from "../repositories/cartsRepository.js";
import * as productsService from "../services/productsService.js";

export async function getCartById(id) {
  const cart = await cartsRepository.findById(id);

  return cart;
}

export async function getOrCreateCart(cartId) {
  let cart;

  if (!cartId) {
    cart = cartsRepository.createCart();
    res.cookie("cartId", cart.id);
  } else {
    cart = cartsRepository.findById(cartId);

    if (!cart) {
      cart = cartsRepository.createCart();
      res.cookie("cartId", cart.id);
    }
  }

  return cart;
}

export async function addItemToCart(cartId, productId) {
  const cart = await getCartById(cartId);
  const product = await productsService.getProductById(productId);

  // El producto esta en carrito?
  const cartItem = cart.items.find((item) => item.product.id === product.id);

  // Si sí está, añadir 1 a la cantidad actual
  if (cartItem) {
    // modificar el carrito actual
    cartItem.quantity += 1;
    cartItem.subtotal += product.price;
  } else {
    // Si no está, crear y añadir el Item para este producto
    const newItem = {
      product: {
        id: product.id,
        title: product.title,
        imgSrc: product.imgSrc,
        price: product.price,
      },
      quantity: 1,
      subtotal: product.price,
    };
    cart.items.push(newItem);
  }

  cart.total += product.price;
  cart.totalQuantity += 1;

  cartsRepository.updateCart(cart);
}

export async function deleteItemFromCart(cartId, productId) {
  const cart = await getCartById(cartId);

  const index = cart.items.findIndex((item) => item.product.id === productId);
  const item = cart.items[index];

  cart.total -= item.subtotal;
  cart.totalQuantity -= item.quantity;

  cart.items.splice(index, 1);

  cartsRepository.updateCart(cart);
}

export async function updateItemFromCart(cartId, productId, quantity) {
  const cart = await getCartById(cartId);

  const item = cart.items.find((item) => item.product.id === productId);

  const deltaQuantity = quantity - item.quantity;
  const deltaSubTotal = deltaQuantity * item.product.price;

  item.quantity += deltaQuantity;
  item.subtotal += deltaSubTotal;

  cart.totalQuantity += deltaQuantity;
  cart.total += deltaSubTotal;

  cartsRepository.updateCart(cart);
}
