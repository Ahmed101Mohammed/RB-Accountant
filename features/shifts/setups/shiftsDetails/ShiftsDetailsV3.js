export class ShiftsDetailsV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS shifts_details(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  shift_id INTEGER UNIQUE NOT NULL,
                  day TEXT NOT NULL CHECK (day IN ('sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri')),
                  start_hour INTEGER CHECK (start_hour BETWEEN 0 AND 23),
                  start_minute INTEGER DEFAULT 0 CHECK (start_minute BETWEEN 0 AND 59),
                  end_hour INTEGER CHECK (end_hour BETWEEN 0 AND 23),
                  end_minute INTEGER DEFAULT 0 CHECK (end_minute BETWEEN 0 AND 59),

                  FOREIGN KEY (shift_id) REFERENCES shifts(id)
                ) STRICT`;
}