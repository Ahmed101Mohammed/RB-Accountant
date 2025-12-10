import BaseDB from "./BaseDB.js";

export class ProductRepresentativeEntity {
  static db = BaseDB.getDB();
  static createTableCommand =
    db.prepare(`CREATE TABLE IF NOT EXISTS product_representative_entity(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  entity_id TEXT UNIQUE NOT NULL CHECK (length(entity_id) BETWEEN 3 AND 19),
                  name TEXT UNIQUE NOT NULL (length(name) BETWEEN 3 AND 100),
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL
                ) STRICT`);
}
