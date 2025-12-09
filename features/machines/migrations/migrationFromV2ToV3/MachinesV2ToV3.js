import BaseDB from "../../../../models/BaseDB.js";
import { currentTimeStamp } from "../../../../utils/currentTimeStamp";

export class MachinesV2ToV3
{
  static db = BaseDB.getDB();

  static insertDefaultMachineType = this.db.prepare(`INSERT INTO machine_types (machine_type_id, name, maximum_diameter, registration_time, last_update_time)
    VALUES ('0-0', 'Default Machine Type', 1, '${currentTimeStamp()}', '${currentTimeStamp()}')`);

  static addMachineTypeIdColumn = this.db.prepare(`ALTER TABLE machines
    ADD COLUMN machine_type_id INTEGER`);

  static updateMachineTypeIdForMachines = this.db.prepare(`UPDATE machines
    SET machine_type_id = (SELECT id 
      FROM machine_types
      WHERE machine_type_id = '0-0'
      );`);

  static renameMachinesTableToOldMachines = this.db.prepare(`ALTER TABLE machines
    RENAME TO old_machines;
    `)

  static insertOldMachineToMachines = this.db.prepare(`INSERT INTO machines (id, machine_id, machine_type_id, name, registration_time, last_update_time)
    SELECT internal_id, id, machine_type_id, name, '${currentTimeStamp()}', '${currentTimeStamp()}'
    FROM old_machines;`);

  static deleteOldMachines = db.prepare(`DROP TABLE old_machines;`); 
}