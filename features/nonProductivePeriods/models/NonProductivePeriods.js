import BaseDB from "../../../models/BaseDB.js";

export class NonProductivePeriods
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS non_productive_periods(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT UNIQUE NOT NULL (length(name) BETWEEN 3 AND 100),
                  registration_date TEXT NOT NULL,
                  last_update_date TEXT NOT NULL      
                ) STRICT`
              );
  
}