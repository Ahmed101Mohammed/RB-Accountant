import BaseDB from "../../../models/BaseDB.js";

export class ShiftsDetails
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS shifts_details(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  shift_id TEXT UNIQUE NOT NULL CHECK (length(shift_id) BETWEEN 3 AND 19),
                  day TEXT NOT NULL CHECK (day IN (sat, sun, mon, tue, wed, thu, fri)),
                  start_hour INTEGER CHECK (start_hour BETWEEN 0 AND 23),
                  start_minute INTEGER DEFAULT 0 CHECK (start_minute BETWEEN 0 AND 59),
                  end_hour INTEGER CHECK (end_hour BETWEEN 0 AND 23),
                  end_minute INTEGER DEFAULT 0 CHECK (end_minute BETWEEN 0 AND 59),
                  valid_from TEXT NOT NULL,
                  valid_to TEXT,

                  FOREIGN KEY (shift_id) REFERENCES shifts(id),
                  CHECK (end_hour >= start_hour)
                ) STRICT`
              );
  
}