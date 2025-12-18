export class ProductionRatesV3
{
  static createTableCommand = `CREATE TABLE IF NOT EXISTS production_rates(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  machine_id INTEGER NOT NULL,
                  product_id INTEGER NOT NULL,
                  employee_id INTEGER NOT NULL,
                  rate INTEGER NOT NULL CHECK (rate BETWEEN 1 AND 1000000000000000),
                  valid_from TEXT NOT NULL,
                  valid_to TEXT,

                  FOREIGN KEY (machine_id) REFERENCES machines(id),
                  FOREIGN KEY (product_id) REFERENCES products(id),
                  FOREIGN KEY (employee_id) REFERENCES employees(id)             
                ) STRICT`;
  
}