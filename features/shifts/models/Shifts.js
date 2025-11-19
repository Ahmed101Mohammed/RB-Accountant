import BaseDB from "../../../models/BaseDB.js";

export class Shifts
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS shifts(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  shift_id TEXT UNIQUE NOT NULL CHECK (length(shift_id) BETWEEN 3 AND 19),
                  name TEXT UNIQUE NOT NULL CHECK (length(name) BETWEEN 3 AND 100),
                  registration_date TEXT NOT NULL,
                  last_update_date TEXT NOT NULL
                ) STRICT`
              );
  
}