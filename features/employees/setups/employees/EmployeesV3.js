export class EmployeesV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS employees(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  account_id INTEGER UNIQUE NOT NULL,
                  shift_id INTEGER NOT NULL,
                  phone_number TEXT UNIQUE CHECK (length(phone_number) = 13),
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL,

                  FOREIGN KEY (account_id) REFERENCES accounts(id),
                  FOREIGN KEY (shift_id) REFERENCES shifts(id)
                ) STRICT`;
}