export class ShiftsV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS shifts(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  shift_id TEXT UNIQUE NOT NULL CHECK (length(shift_id) BETWEEN 3 AND 19),
                  name TEXT UNIQUE NOT NULL CHECK (length(name) BETWEEN 3 AND 100),
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL
                ) STRICT`;
}