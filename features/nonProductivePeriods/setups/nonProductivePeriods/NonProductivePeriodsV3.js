export class NonProductivePeriodsV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS non_productive_periods(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT UNIQUE NOT NULL CHECK (length(name) BETWEEN 3 AND 100),
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL      
                ) STRICT`;
}