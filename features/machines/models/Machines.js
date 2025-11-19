import BaseDB from "../../../models/BaseDB.js";
import { MachineBody } from "../entities/MachineBody.js";
import { Machine as MachineEntity } from "../entities/Machine.js"
import ErrorHandler from "../../../utils/ErrorHandler.js";

export class Machines
{	
  static db = BaseDB.getDB();
  static createTableCommand = db.prepare(`CREATE TABLE IF NOT EXISTS machines(
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  machine_id TEXT UNIQUE NOT NULL CHECK (length(machine_id) BETWEEN 3 AND 19),
                  machine_type_id INTEGER NOT NULL,
                  name TEXT UNIQUE NOT NULL (length(name) BETWEEN 3 AND 100),
                  registration_date TEXT NOT NULL,
                  last_update_date TEXT NOT NULL,
                  
                  FOREIGN KEY (machine_type_id) REFERENCES machine_types(id)
                ) STRICT`
              );
              
  static isSetUped = false
  static setUp()
  {
    BaseDB.updateDB()
    const db = BaseDB.getDB()
    const create = db.prepare(`CREATE TABLE IF NOT EXISTS machines(
                  id TEXT UNIQUE NOT NULL,
                  internal_id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT UNIQUE NOT NULL
                ) STRICT`
              )
    create.run()
    Machine.isSetUped = true;
  }

  static create(machine)
  {
    if(!Machine.isSetUped) Machine.setUp()
    if(!MachineBody.isMachineBody(machine)) throw new Error('(model): Machine.create method: expect MachineBody object');
    const machineId = machine.id;
    const machineName = machine.name;
    const db = BaseDB.getDB();
    const insert = db.prepare('INSERT INTO machines (id, name) VALUES (@id, @name)');
    try
    {
      const response = insert.run({
        id: machineId,
        name: machineName
      })

      return response
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      throw error
    }
  }

  static getAllMachines()
  {
    if(!Machine.isSetUped) Machine.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM machines ORDER BY id ASC;')
    const machines = query.all();
    const machinesEntities = MachineEntity.createMultibleMachinesEntities(machines)
    return machinesEntities
  }

  static getMachineByName(name)
  {
    if(!Machine.isSetUped) Machine.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM machines WHERE name = @name')
    let machine = query.get({name})
    if(machine) return new MachineEntity(machine.id, machine.name)
    return false
  }

  static getMachineById(id)
  {
    if(!Machine.isSetUped) Machine.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM machines WHERE internal_id = @id')
    let machine = query.get({id});
    let machineBody = new MachineBody(machine.id, machine.name);
    let machineEntity = new MachineEntity(machine.internal_id, machineBody);
    if(machine) return machineEntity;
    return false
  }

  static getMachinesItsNameContain(partialName) {
    if(!Machine.isSetUped) Machine.setUp();
    const db = BaseDB.getDB();
    
    const query = db.prepare('SELECT * FROM machines WHERE name LIKE @name');
    const machines = query.all({ name: `%${partialName}%` });
    const machinesEntities = MachineEntity.createMultibleMachinesEntities(machines)
    return machinesEntities;
  }

  static getMachinesItsIdContain(partialId) {
    if(!Machine.isSetUped) Machine.setUp();
    const db = BaseDB.getDB();
    
    const query = db.prepare('SELECT * FROM machines WHERE id LIKE @id');
    const machines = query.all({ id: `%${partialId}%` });
    const machinesEntities = MachineEntity.createMultibleMachinesEntities(machines)
    return machinesEntities;
  }

  static delete(internalId)
  {
    if(!Machine.isSetUped) Machine.setUp();
    const db = BaseDB.getDB();    
    const deleteMachine = db.prepare('DELETE FROM machines WHERE internal_id = @internalId');
    return deleteMachine.run({internalId});
  }

  static update(machine)
  {
    if(!Machine.isSetUped) Machine.setUp();
    if(!MachineEntity.isMachine(machine)) throw new Error('(model) Machine.update method: expect Machine object');
    const machineInternalId = machine.id;
    const machineId = machine.bodyId;
    const machineName = machine.bodyName;
    const db = BaseDB.getDB();
    const query = db.prepare('UPDATE machines SET name=@newName, id=@newId WHERE internal_id = @internalId');
    try
    {
      const response = query.run({
        internalId: machineInternalId,
        newId: machineId,
        newName: machineName
      });
      return response;
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      return error
    }
  }

  static getInternalIdsForIds(ids)
  {
    if(!Machine.isSetUped) Machine.setUp();
    const db = BaseDB.getDB();
    const getMany = db.transaction(ids => 
    {
      const internalIds = [];
      const getId = db.prepare('SELECT internal_id FROM machines WHERE id = @id');
      for(let id of ids)
      {
        const row = getId.get({id});
        internalIds.push(row? row.internal_id : null);
      }
      return internalIds;
    }
    )

    try
    {
      const response = getMany(ids);
      return response;
    }
    catch(error)
    {
      throw error;
    }
  }

  static getMissingIds(ids) {
    if (!ids.length) return [];

    const db = BaseDB.getDB();

    // Create the VALUES list: (?, ?), (?, ?), ...
    const valuesClause = ids.map(() => '(?)').join(', ');
    const query = `
      WITH input_ids(id) AS (
        VALUES ${valuesClause}
      )
      SELECT input_ids.id
      FROM input_ids
      LEFT JOIN machines ON input_ids.id = machines.id
      WHERE machines.id IS NULL;
    `;

    const stmt = db.prepare(query);
    const result = stmt.all(...ids);

    return result.map(row => row.id);
  }
}