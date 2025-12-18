export class ShiftsProductionDetailsV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS shifts_production_details(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  shift_production_id INTEGER NOT NULL,
                  product_id INTEGER NOT NULL,
                  product_production_stage INTEGER DEFAULT 1 CHECK (product_production_stage BETWEEN 1 AND 1000000000000000),
                  machine_id INTEGER NOT NULL,
                  employee_id INTEGER NOT NULL,
                  start_date TEXT NOT NULL,
                  start_hour INTEGER CHECK (start_hour BETWEEN 0 AND 23),
                  end_date TEXT NOT NULL,
                  start_minute INTEGER DEFAULT 0 CHECK (start_minute BETWEEN 0 AND 59),
                  end_hour INTEGER CHECK (end_hour BETWEEN 0 AND 23),
                  end_minute INTEGER DEFAULT 0 CHECK (end_minute BETWEEN 0 AND 59),
                  high_quality_quantity INTEGER NOT NULL DEFAULT 0 CHECK (high_quality_quantity BETWEEN 0 AND 1000000000000000),
                  low_quality_quantity INTEGER NOT NULL DEFAULT 0 CHECK (low_quality_quantity BETWEEN 0 AND 1000000000000000),

                  FOREIGN KEY (shift_production_id) REFERENCES shifts_production(id) ON DELETE CASCADE,
                  FOREIGN KEY (product_id) REFERENCES products(id),
                  FOREIGN KEY (machine_id) REFERENCES machines(id),
                  FOREIGN KEY (employee_id) REFERENCES employees(id)    
                ) STRICT`;
}