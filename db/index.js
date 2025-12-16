import fs from "fs/promises";

export async function readDb() {
  const dbJson = await fs.readFile("./data/data.json", "utf8");
  const db = JSON.parse(dbJson);

  return db;
}

export async function writeDb(db) {
  const dbJson = JSON.stringify(db, null, 2);
  await fs.writeFile("./data/data.json", dbJson, "utf8");
}

export function getNextId(collection) {
  return collection.length > 0
    ? Math.max(...collection.map((item) => item.id)) + 1
    : 1;
}
