import BaseDB from "../../../models/BaseDB.js";

export class MachinesFaults
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS machines_faults(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  machine_id INTEGER NOT NULL,
                  technician_id INTEGER NOT NULL,
                  technician_cost INTEGER DEFAULT 0 CHECK (technician_cost BETWEEN 0 AND 1000000000000000),
                  start_time TEXT NOT NULL,
                  end_time TEXT,
                  comment TEXT NOT NULL DEFAULT '' CHECK (length(comment) <= 500),
                  registration_date TEXT NOT NULL,
                  last_update_date TEXT NOT NULL,

                  FOREIGN KEY (machine_id) REFERENCES machines(id),
                  FOREIGN KEY (technician_id) REFERENCES technicians(id)                  
                ) STRICT`
              );
  
}