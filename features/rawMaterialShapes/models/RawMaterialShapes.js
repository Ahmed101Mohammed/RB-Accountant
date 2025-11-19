import BaseDB from "../../../models/BaseDB.js";

export class RawMaterialShapes
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS raw_material_shapes(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  raw_material_shape_id TEXT UNIQUE NOT NULL CHECK (length(raw_material_shape_id) BETWEEN 3 AND 19),
                  name TEXT UNIQUE NOT NULL (length(name) BETWEEN 3 AND 100),
                  factor REAL NOT NULL CHECK (factor BETWEEN 0.001 AND 1000),
                  registration_date TEXT NOT NULL,
                  last_update_date TEXT NOT NULL
                ) STRICT`
              );
  
}