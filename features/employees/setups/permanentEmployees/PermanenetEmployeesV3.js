export class PermanentEmployeesV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS permanent_employees(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  employee_id INTEGER UNIQUE NOT NULL,
                  base_salary INTEGER NOT NULL CHECK (base_salary BETWEEN 0 AND 1000000000000000),
                  assurance INTEGER DEFAULT 0 CHECK (base_salary BETWEEN 0 AND 1000000000000000),
                  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
                ) STRICT`;
  
}