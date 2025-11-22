import { readDb, writeDb } from "../data/db.js";

export async function insertOrder(orderData) {
  const db = await readDb();

  const order = {
    id: Math.random() * 10 ** 17,
    ...orderData,
  };

  db.orders.push(order);

  await writeDb(db);

  return order;
}
