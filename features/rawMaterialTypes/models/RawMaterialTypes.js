import BaseDB from "../../../models/BaseDB.js";

export class RawMaterialTypes
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS raw_material_types(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  raw_material_type_id TEXT UNIQUE NOT NULL CHECK (length(raw_material_type_id) BETWEEN 3 AND 19),
                  name TEXT UNIQUE NOT NULL (length(name) BETWEEN 3 AND 100),
                  density REAL NOT NULL CHECK (density BETWEEN 0.001 AND 30),
                  price INTEGER NOT NULL DEFAULT 0 CHECK (price BETWEEN 0 AND 1000000000000000),
                  recycling_price INTEGER NOT NULL DEFAULT 0 CHECK (price BETWEEN 0 AND 1000000000000000),
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL
                ) STRICT`
              );
  
}