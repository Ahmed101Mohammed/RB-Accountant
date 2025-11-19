import BaseDB from "../../../models/BaseDB.js";

export class CasualEmployees
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS casual_employees(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  employee_id INTEGER UNIQUE NOT NULL,
                  day_rate INTEGER NOT NULL DEFAULT 0 CHECK (base_salary BETWEEN 0 AND 1000000000000000),
                  registration_date TEXT NOT NULL,
                  last_update_date TEXT NOT NULL,

                  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
                ) STRICT`
              );
  
}