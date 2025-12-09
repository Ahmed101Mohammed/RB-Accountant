import BaseDB from "../../../models/BaseDB.js";

export class NonProductiveDurations
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS non_productive_durations(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  non_productive_period_id INTEGER UNIQUE NOT NULL,
                  duration INTEGER NOT NULL CHECK (duration BETWEEN 0 AND 86400),
                  valid_from TEXT NOT NULL,
                  valid_to TEXT,

                  FOREIGN KEY (non_productive_period_id) REFERENCES non_productive_periods(id) ON DELETE CASCADE            
                ) STRICT`
              );
  
}