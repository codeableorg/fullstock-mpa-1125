import * as ordersRepository from "../repositories/ordersRepository.js";
import * as cartsService from "./cartsService.js";

export async function createOrder(cartId, email, shippingInfo) {
  const cart = await cartsService.getCartById(cartId);

  const orderData = {
    email,
    orderDetails: cart,
    shippingInfo,
  };

  const order = await ordersRepository.insertOrder(orderData);

  return order;
}
