import BaseDB from "../../../models/BaseDB.js";

export class ShiftsProductionDetails
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS shifts_production_details(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  shift_production_id INTEGER NOT NULL,
                  product_id INTEGER NOT NULL,
                  product_production_stage INTEGER DEFAULT 1 CHECK (product_production_stage BETWEEN 1 AND 1000000000000000),
                  machine_id INTEGER NOT NULL,
                  employee_id INTEGER NOT NULL,
                  start_work TEXT NOT NULL,
                  end_work TEXT NOT NULL,
                  good_quality_quantities INTEGER NOT NULL DEFAULT 0 CHECK (good_quality_quantities BETWEEN 0 AND 1000000000000000),
                  bad_quality_quantities INTEGER NOT NULL DEFAULT 0 CHECK (bad_quality_quantities BETWEEN 0 AND 1000000000000000),
                  registration_date TEXT NOT NULL,
                  last_update_date TEXT NOT NULL,

                  FOREIGN KEY (shift_production_id) REFERENCES shifts_production(id),
                  FOREIGN KEY (product_id) REFERENCES products(id),
                  FOREIGN KEY (machine_id) REFERENCES machines(id),
                  FOREIGN KEY (employee_id) REFERENCES employees(id)             
                ) STRICT`
              );
  
}