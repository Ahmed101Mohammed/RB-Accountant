export class TransactionsV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS transactions(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  date TEXT NOT NULL,
                  registration_time TEXT NOT NULL CHECK (registration_time GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]'),
                  last_update_time TEXT NOT NULL CHECK (registration_time GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9] [0-9][0-9]:[0-9][0-9]:[0-9][0-9]')
                ) STRICT`;
}