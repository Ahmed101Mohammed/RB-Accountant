export class ShiftsProductionDetailsV2
{
  static createTableCommand1 = `
      CREATE TABLE IF NOT EXISTS shifts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        daily_production_id INTEGER NOT NULL,
        name TEXT NOT NULL CHECK (name IN ('morning', 'night', 'overtime')),
        start_at INTEGER NOT NULL CHECK (start_at BETWEEN 0 AND 23),
        end_at INTEGER NOT NULL CHECK (end_at BETWEEN 0 AND 23),
        
        FOREIGN KEY (daily_production_id) REFERENCES daily_production(id) ON DELETE CASCADE,

        UNIQUE (daily_production_id, name),
        UNIQUE (daily_production_id, start_at),
        UNIQUE (daily_production_id, end_at)
      ) STRICT`;


    static createTableCommand2 = `
      CREATE TABLE IF NOT EXISTS shifts_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shift_id INTEGER NOT NULL,
        item_id INTEGER NOT NULL,
        FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
        FOREIGN KEY (item_id) REFERENCES items(internal_id)
      ) STRICT`;

    static createTableCommand3 = `
      CREATE TABLE IF NOT EXISTS shifts_items_accounts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shift_item_id INTEGER NOT NULL,
        account_id INTEGER NOT NULL,
        FOREIGN KEY (shift_item_id) REFERENCES shifts_items(id) ON DELETE CASCADE,
        FOREIGN KEY (account_id) REFERENCES accounts(id)
      ) STRICT`;

    static createTableCommand4 = `
      CREATE TABLE IF NOT EXISTS shifts_items_assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        shift_item_id INTEGER NOT NULL,
        employee_id INTEGER NOT NULL,
        machine_id INTEGER NOT NULL,
        start_at INTEGER NOT NULL CHECK (start_at BETWEEN 0 AND 23),
        end_at INTEGER NOT NULL CHECK (end_at BETWEEN 0 AND 23),
        high_quality_quantity INTEGER NOT NULL CHECK (high_quality_quantity >= 0),
        low_quality_quantity INTEGER NOT NULL CHECK (low_quality_quantity >= 0),
        FOREIGN KEY (shift_item_id) REFERENCES shifts_items(id) ON DELETE CASCADE,
        FOREIGN KEY (employee_id) REFERENCES employees(internal_id),
        FOREIGN KEY (machine_id) REFERENCES machines(internal_id),

        UNIQUE (shift_item_id, employee_id, machine_id, start_at),
        UNIQUE (shift_item_id, employee_id, machine_id, end_at)
      ) STRICT`;
}