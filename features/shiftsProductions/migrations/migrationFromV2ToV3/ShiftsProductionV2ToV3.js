import BaseDB from "../../../../models/BaseDB.js";
import { currentTimeStamp } from "../../../../utils/currentTimeStamp.js";

export class ShiftsProductionV2ToV3 {
  static db = BaseDB.getDB();

  static insertOldShiftsToShiftsProduction = ShiftsProductionV2ToV3.db
    .prepare(`INSERT INTO shifts_production (id, start_date, end_date, name, start_hour, end_hour, registration_time, last_update_time)
      SELECT old_shifts.id,
            date, 
            date, 
            (CASE name
              WHEN 'morning' THEN 'صباحي'
              WHEN 'night' THEN 'مسائي'
              ELSE 'إضافي'
              END),
              old_shifts.start_at,
              old_shifts.end_at,
              ${currentTimeStamp()},
              ${currentTimeStamp()}
      FROM daily_production
      JOIN old_shifts ON old_shifts.daily_production_id = daily_production.id`);

    
    static deleteDailyProductionTable = ShiftsProductionV2ToV3.db.prepare(`DROP TABLE daily_production;`);

    static deleteOldShiftsTable = ShiftsProductionV2ToV3.db.prepare(`DROP TABLE old_shifts;`);
}
