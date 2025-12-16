import { getNextId, readDb, writeDb } from "../db/index.js";

export async function createOrder(orderData) {
  const db = await readDb();

  const order = {
    id: getNextId("orders"),
    ...orderData,
  };

  db.orders.push(order);

  await writeDb(db);

  return order;
}
