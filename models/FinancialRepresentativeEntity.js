import BaseDB from "./BaseDB.js";

export class FinancialRepresentativeEntity
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS financial_representative_entity(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  entity_id TEXT UNIQUE NOT NULL CHECK (length(entity_id) BETWEEN 1 AND 100),
                  name TEXT UNIQUE NOT NULL (length(name) BETWEEN 3 AND 100),
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL
                ) STRICT`
              );
  
}