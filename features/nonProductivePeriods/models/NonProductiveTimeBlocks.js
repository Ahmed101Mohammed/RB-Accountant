import BaseDB from "../../../models/BaseDB.js";

export class NonProductiveTimeBlocks
{
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS non_productive_time_blocks(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  non_productive_period_id INTEGER UNIQUE NOT NULL,
                  start_hour INTEGER CHECK (start_hour BETWEEN 0 AND 23),
                  start_minute INTEGER DEFAULT 0 CHECK (start_minute BETWEEN 0 AND 59),
                  end_hour INTEGER CHECK (end_hour BETWEEN 0 AND 23),
                  end_minute INTEGER DEFAULT 0 CHECK (end_minute BETWEEN 0 AND 59),
                  valid_from TEXT NOT NULL,
                  valid_to TEXT,

                  FOREIGN KEY (non_productive_period_id) REFERENCES non_productive_periods(id) ON DELETE CASCADE,
                  CHECK (end_hour >= start_hour)              
                ) STRICT`
              );
  
}