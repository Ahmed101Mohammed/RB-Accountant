export class ShiftsProductionDetailsV2ToV3 {
  static insertOldShiftsProductionDetailsToShiftsProductionDetails = `INSERT INTO shifts_production_details (shift_production_id, product_id, machine_id, employee_id, start_date, start_hour, end_date, end_hour, high_quality_quantity, low_quality_quantity)
      SELECT s.id,
        si.item_id,
        sia.machine_id,
        sia.employee_id,
        dp.date,
        sia.start_at,
        dp.date,
        sia.end_at,
        sia.high_quality_quantity,
        sia.low_quality_quantity
      FROM daily_production AS dp
      JOIN old_shifts AS s ON s.daily_production_id = dp.id
      JOIN shifts_items AS si ON si.shift_id = s.id
      JOIN shifts_items_assignments AS sia ON sia.shift_item_id = si.id`;

  static deleteShiftsItems = `DROP TABLE shifts_items;`;

  static deleteShiftsItemsAccounts = `DROP TABLE shifts_items_accounts;`;

  static deleteShiftsItemsAssignments = `DROP TABLE shifts_items_assignments;`;
}
