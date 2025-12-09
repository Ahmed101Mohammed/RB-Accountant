import BaseDB from "../../../../models/BaseDB.js";
import { currentTimeStamp } from "../../../utils/currentTimeStamp.js";
export class EmployeesV2ToV3
{
  static db = BaseDB.getDB();

  static insertEmployeesToFinancialRepresentativeEntity = db.prepare(`INSERT INTO financial_representative_entity (entity_id, name, registration_time, last_update_time)
                  SELECT id, name, '${currentTimeStamp()}', '${currentTimeStamp()}' FROM employees;`);

  static createDefaultShift = this.db.prepare(`INSERT INTO shifts (shift_id, name, registration_time, last_update_time)
    VALUES ('0-0', 'default shift', '${currentTimeStamp()}', '${currentTimeStamp()}');`);
  
  static createDefaultShiftDetails = this.db.prepare(`INSERT INTO shifts_details (shift_id, day, start_hour, start_minute, end_hour, end_minute, valid_from)
    SELECT id, 'sat', 0, 0, 1, 1, ${currentTimeStamp()}
    FROM shifts
    WHERE shift_id = '0-0';`);

  static addAccountIdColumn = this.db.prepare(`ALTER TABLE employees
    ADD COLUMN account_id 
    INTEGER 
    UNIQUE`);

  static addShiftIdColumn = this.db.prepare(`ALTER TABLE employees
    ADD COLUMN shift_id 
    INTEGER`);

  static addRegistrationTimeColumn = this.db.prepare(`ALTER TABLE employees
    ADD COLUMN registration_time 
    TEXT`);


  static addLastUpdateTimeColumn = this.db.prepare(`ALTER TABLE employees
  ADD COLUMN last_update_time 
  TEXT`);

  static updateAccountIdForEmployees = this.db.prepare(`UPDATE employees
    SET account_id = (SELECT accounts.id 
      FROM accounts
      JOIN financial_representative_entity ON accounts.financial_representative_entity_id = financial_representative_entity.id
      WHERE employees.id = financial_representative_entity.entity_id
      );`);

  static updateShiftIdForEmployees = this.db.prepare(`UPDATE employees
    SET shift_id = (SELECT id 
      FROM shifts
      WHERE shift_id = '0-0'
      );`)

  static updateRegistrationTimeAndLastUpdateTimeForEmployees = this.db.prepare(`UPDATE employees
    SET registration_time = '${currentTimeStamp()}',
        last_update_time = '${currentTimeStamp()}';`);

  static renameEmployeesTableToOldEmployees = this.db.prepare(`ALTER TABLE employees
    RENAME TO old_employees;
    `)

  static insertOldEmployeesToEmployees = this.db.prepare(`INSERT INTO employees (id, account_id, shift_id, registration_time, last_update_time)
    SELECT internal_id, account_id, shift_id, registration_time, last_update_time
    FROM old_employees;`);

  static deleteOldEmployees = db.prepare(`DROP TABLE old_employees;`);

  static insertAllEmployeesToPermenantEmployees = this.db.prepare(`INSERT INTO permanent_employees (employee_id, base_salary)
    SELECT id, 0
    FROM employees`)
}