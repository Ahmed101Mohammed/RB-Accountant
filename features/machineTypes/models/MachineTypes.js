import BaseDB from "../../../models/BaseDB.js";

export class MachineTypes
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS machine_types(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  machine_type_id TEXT UNIQUE NOT NULL CHECK (length(machine_type_id) BETWEEN 3 AND 19),
                  name TEXT UNIQUE NOT NULL (length(name) BETWEEN 3 AND 100),
                  maximum_diameter INTEGER NOT NULL CHECK (external_diameter BETWEEN 1 AND 1000000000000000),
                  registration_date TEXT NOT NULL,
                  last_update_date TEXT NOT NULL
                  
                ) STRICT`
              );
  
}