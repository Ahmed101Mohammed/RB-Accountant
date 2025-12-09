import BaseDB from "../../../models/BaseDB.js";

export class AccountsGroups
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS accounts_groups(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  financial_representative_entity_id INTEGER UNIQUE NOT NULL,
                  account_group_id INTEGER UNIQUE,
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL,

                  FOREIGN KEY (financial_representative_entity_id) REFERENCES financial_representative_entity(id),
                  FOREIGN KEY (account_group_id) REFERENCES accounts_groups(id)
                ) STRICT`
              );
  
}