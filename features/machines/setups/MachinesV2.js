export class MachinesV2
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS machines(
                  id TEXT UNIQUE NOT NULL,
                  internal_id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT UNIQUE NOT NULL
                ) STRICT`;
}