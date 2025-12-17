export class MachinesV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS machines(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  machine_id TEXT UNIQUE NOT NULL CHECK (length(machine_id) BETWEEN 3 AND 19),
                  machine_type_id INTEGER NOT NULL,
                  name TEXT UNIQUE NOT NULL CHECK (length(name) BETWEEN 3 AND 100),
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL,
                  
                  FOREIGN KEY (machine_type_id) REFERENCES machine_types(id)
                ) STRICT`;
}