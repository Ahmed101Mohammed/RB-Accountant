import { currentTimeStamp } from "../../../../utils/currentTimeStamp.js";

export class MachinesV2ToV3 {
  static insertDefaultMachineType = `INSERT INTO machine_types (machine_type_id, name, maximum_diameter, registration_time, last_update_time)
    VALUES ('0-0', 'Default Machine Type', 1, '${currentTimeStamp()}', '${currentTimeStamp()}')`;

  static addMachineTypeIdColumn = `ALTER TABLE machines
      ADD COLUMN machine_type_id INTEGER`;

  static updateMachineTypeIdForMachines = `UPDATE machines
      SET machine_type_id = (SELECT id 
        FROM machine_types
        WHERE machine_type_id = '0-0'
        );`;

  static renameMachinesTableToOldMachines = `ALTER TABLE machines
      RENAME TO old_machines;
      `;

  static insertOldMachineToMachines = `INSERT INTO machines (id, machine_id, machine_type_id, name, registration_time, last_update_time)
      SELECT internal_id, 
        CASE WHEN instr(id, '-') = 0 OR length(id) < 3
          THEN 'm-' || id
          ELSE id
        END, 
        machine_type_id, 
        name, 
        '${currentTimeStamp()}', 
        '${currentTimeStamp()}'
      FROM old_machines;`;

  static deleteOldMachines = `DROP TABLE old_machines;`;
}
