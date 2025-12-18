export class ShiftsProductionV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS shifts_production(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  start_date TEXT NOT NULL,
                  end_date TEXT NOT NULL,
                  name TEXT NOT NULL CHECK (length(name) BETWEEN 3 AND 100),
                  start_hour INTEGER CHECK (start_hour BETWEEN 0 AND 23),
                  start_minute INTEGER DEFAULT 0 CHECK (start_minute BETWEEN 0 AND 59),
                  end_hour INTEGER CHECK (end_hour BETWEEN 0 AND 23),
                  end_minute INTEGER DEFAULT 0 CHECK (end_minute BETWEEN 0 AND 59),
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL,
                  UNIQUE (start_date, start_hour, start_minute)
                  UNIQUE (end_date, end_hour, end_minute)
                ) STRICT`;
}