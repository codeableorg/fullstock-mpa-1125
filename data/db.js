import fs from "fs/promises";

export async function readDb() {
  const dbJson = await fs.readFile("./data/db.json", "utf8");
  const db = JSON.parse(dbJson);

  return db;
}

export function writeDb(db) {
  const dbJson = JSON.stringify(db, null, 2);
  fs.writeFile("./data/db.json", dbJson, "utf8");
}
