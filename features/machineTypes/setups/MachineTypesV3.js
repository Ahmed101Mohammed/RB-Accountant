export class MachineTypesV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS machine_types(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  machine_type_id TEXT UNIQUE NOT NULL CHECK (length(machine_type_id) BETWEEN 3 AND 19),
                  name TEXT UNIQUE NOT NULL CHECK (length(name) BETWEEN 3 AND 100),
                  maximum_diameter INTEGER NOT NULL CHECK (maximum_diameter BETWEEN 1 AND 1000000000000000),
                  registration_time TEXT NOT NULL,
                  last_update_time TEXT NOT NULL
                ) STRICT`;
  
}