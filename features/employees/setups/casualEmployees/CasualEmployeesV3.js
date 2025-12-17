export class CasualEmployeesV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS casual_employees(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  employee_id INTEGER UNIQUE NOT NULL,
                  day_rate INTEGER NOT NULL DEFAULT 0 CHECK (day_rate BETWEEN 0 AND 1000000000000000),

                  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
                ) STRICT`;
  
}