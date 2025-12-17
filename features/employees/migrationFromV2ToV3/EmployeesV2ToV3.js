import { currentTimeStamp } from "../../../utils/currentTimeStamp.js";
export class EmployeesV2ToV3
{
  static insertEmployeesToFinancialRepresentativeEntity = `INSERT INTO financial_representative_entity (entity_id, name, registration_time, last_update_time)
                  SELECT id, name, '${currentTimeStamp()}', '${currentTimeStamp()}' FROM employees;`;

  static renameOldShiftsTable = `ALTER TABLE shifts
    RENAME TO old_shifts;`;
    
  static createDefaultShift = `INSERT INTO shifts (shift_id, name, registration_time, last_update_time)
    VALUES ('0-0', 'default shift', '${currentTimeStamp()}', '${currentTimeStamp()}');`;
  
  static createDefaultShiftDetails = `INSERT INTO shifts_details (shift_id, day, start_hour, start_minute, end_hour, end_minute)
    SELECT id, 'sat', 0, 0, 1, 1
    FROM shifts
    WHERE shift_id = '0-0';`;

  static addAccountIdColumn = `ALTER TABLE employees
    ADD COLUMN account_id 
    INTEGER;`;

  static addShiftIdColumn = `ALTER TABLE employees
    ADD COLUMN shift_id 
    INTEGER`;

  static addRegistrationTimeColumn = `ALTER TABLE employees
    ADD COLUMN registration_time 
    TEXT`;


  static addLastUpdateTimeColumn = `ALTER TABLE employees
  ADD COLUMN last_update_time 
  TEXT`;

  static updateAccountIdForEmployees = `UPDATE employees
    SET account_id = (SELECT accounts.id 
      FROM accounts
      JOIN financial_representative_entity ON accounts.financial_representative_entity_id = financial_representative_entity.id
      WHERE employees.id = financial_representative_entity.entity_id
      );`;

  static updateShiftIdForEmployees = `UPDATE employees
    SET shift_id = (SELECT id 
      FROM shifts
      WHERE shift_id = '0-0'
      );`

  static updateRegistrationTimeAndLastUpdateTimeForEmployees = `UPDATE employees
    SET registration_time = '${currentTimeStamp()}',
        last_update_time = '${currentTimeStamp()}';`;

  static renameEmployeesTableToOldEmployees = `ALTER TABLE employees
    RENAME TO old_employees;
    `

  static insertOldEmployeesToEmployees = `INSERT INTO employees (id, account_id, shift_id, registration_time, last_update_time)
    SELECT internal_id, account_id, shift_id, registration_time, last_update_time
    FROM old_employees;`;

  static deleteOldEmployees = `DROP TABLE old_employees;`;

  static insertAllEmployeesToPermenantEmployees = `INSERT INTO permanent_employees (employee_id, base_salary)
    SELECT id, 0
    FROM employees`
}