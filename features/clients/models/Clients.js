import BaseDB from "../../../models/BaseDB.js";

export class Clients
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS clients(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  account_id INTEGER UNIQUE NOT NULL,
                  company_registration_number TEXT UNIQUE CHECK (length(company_registration_number) BETWEEN 1 AND 100),
                  credit_period INTEGER DEFAULT 0 CHECK (credit_period BETWEEN 0 AND 365),
                  phone_number TEXT UNIQUE CHECK (length(phone_number) BETWEEN 3 AND 13),
                  representative_name TEXT UNIQUE CHECK (length(representative_name) BETWEEN 3 AND 100),
                  registration_date TEXT NOT NULL,
                  last_update_date TEXT NOT NULL,

                  FOREIGN KEY (account_id) REFERENCES accounts(id)
                ) STRICT`
              );
  
}