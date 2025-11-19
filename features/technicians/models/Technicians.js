import BaseDB from "../../../models/BaseDB.js";

export class Technicians
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS technicians(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  account_id INTEGER UNIQUE NOT NULL,
                  company_registration_number TEXT UNIQUE CHECK (length(company_registration_number) BETWEEN 1 AND 100),
                  phone_number TEXT UNIQUE CHECK (length(phone_number) BETWEEN 3 AND 13),
                  registration_date TEXT NOT NULL,
                  last_update_date TEXT NOT NULL,

                  FOREIGN KEY (account_id) REFERENCES accounts(id)
                ) STRICT`
              );
  
}