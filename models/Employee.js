import BaseDB from "./BaseDB.js";
import { EmployeeBody } from "../entities/employee/EmployeeBody.js";
import { Employee as EmployeeEntity } from "../entities/employee/Employee.js"
import ErrorHandler from "../utils/ErrorHandler.js";

export class Employee
{	
  static isSetUped = false
  static setUp()
  {
    BaseDB.updateDB()
    const db = BaseDB.getDB()
    const create = db.prepare(`CREATE TABLE IF NOT EXISTS employees(
                  id TEXT UNIQUE NOT NULL,
                  internal_id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT UNIQUE NOT NULL
                ) STRICT`
              )
    create.run()
    Employee.isSetUped = true;
  }

  static create(employee)
  {
    if(!Employee.isSetUped) Employee.setUp()
    if(!EmployeeBody.isEmployeeBody(employee)) throw new Error('(model): Employee.create method: expect EmployeeBody object');
    const employeeId = employee.id;
    const employeeName = employee.name;
    const db = BaseDB.getDB();
    const insert = db.prepare('INSERT INTO employees (id, name) VALUES (@id, @name)');
    try
    {
      const response = insert.run({
        id: employeeId,
        name: employeeName
      })

      return response
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      throw error
    }
  }

  static getAllEmployees()
  {
    if(!Employee.isSetUped) Employee.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM employees ORDER BY id ASC;')
    const employees = query.all();
    const employeesEntities = EmployeeEntity.createMultibleEmployeesEntities(employees)
    return employeesEntities
  }

  static getEmployeeByName(name)
  {
    if(!Employee.isSetUped) Employee.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM employees WHERE name = @name')
    let employee = query.get({name})
    if(employee) return new EmployeeEntity(employee.id, employee.name)
    return false
  }

  static getEmployeeById(id)
  {
    if(!Employee.isSetUped) Employee.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM employees WHERE internal_id = @id')
    let employee = query.get({id});
    let employeeBody = new EmployeeBody(employee.id, employee.name);
    let employeeEntity = new EmployeeEntity(employee.internal_id, employeeBody);
    if(employee) return employeeEntity;
    return false
  }

  static getEmployeesItsNameContain(partialName) {
    if(!Employee.isSetUped) Employee.setUp();
    const db = BaseDB.getDB();
    
    const query = db.prepare('SELECT * FROM employees WHERE name LIKE @name');
    const employees = query.all({ name: `%${partialName}%` });
    const employeesEntities = EmployeeEntity.createMultibleEmployeesEntities(employees)
    return employeesEntities;
  }

  static getEmployeesItsIdContain(partialId) {
    if(!Employee.isSetUped) Employee.setUp();
    const db = BaseDB.getDB();
    
    const query = db.prepare('SELECT * FROM employees WHERE id LIKE @id');
    const employees = query.all({ id: `%${partialId}%` });
    const employeesEntities = EmployeeEntity.createMultibleEmployeesEntities(employees)
    return employeesEntities;
  }

  static delete(internalId)
  {
    if(!Employee.isSetUped) Employee.setUp();
    const db = BaseDB.getDB();
    
    const deleteEmployee = db.prepare('DELETE FROM employees WHERE internal_id = @internalId');
    return deleteEmployee.run({internalId});
  }

  static update(employee)
  {
    if(!Employee.isSetUped) Employee.setUp();
    if(!EmployeeEntity.isEmployee(employee)) throw new Error('(model) Employee.update method: expect Employee object');
    const employeeInternalId = employee.id;
    const employeeId = employee.bodyId;
    const employeeName = employee.bodyName;
    const db = BaseDB.getDB();
    const query = db.prepare('UPDATE employees SET name=@newName, id=@newId WHERE internal_id = @internalId');
    try
    {
      const response = query.run({
        internalId: employeeInternalId,
        newId: employeeId,
        newName: employeeName
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
    if(!Employee.isSetUped) Employee.setUp();
    const db = BaseDB.getDB();
    const getMany = db.transaction(ids => 
    {
      const internalIds = [];
      const getId = db.prepare('SELECT internal_id FROM employees WHERE id = @id');
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
      LEFT JOIN employees ON input_ids.id = employees.id
      WHERE employees.id IS NULL;
    `;

    const stmt = db.prepare(query);
    const result = stmt.all(...ids);

    return result.map(row => row.id);
  }
}