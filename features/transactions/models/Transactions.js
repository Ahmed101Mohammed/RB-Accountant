import BaseDB from "../../../models/BaseDB.js";

export class Transactions
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS transactions(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  date TEXT NOT NULL                  
                ) STRICT`
              );
}