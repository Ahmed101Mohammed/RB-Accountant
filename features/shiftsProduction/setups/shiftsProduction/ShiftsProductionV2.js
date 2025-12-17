export class ShiftsProductionV2
{
  static createTableCommand = `
                  CREATE TABLE IF NOT EXISTS daily_production (
                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                      date TEXT UNIQUE NOT NULL,
                      CHECK (date >= '0001-01-01')
                  ) STRICT`;
}