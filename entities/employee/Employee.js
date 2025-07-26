import Joi from "joi";
import { EmployeeBody } from "./EmployeeBody.js";

export class Employee
{
  #id; // internal_id in db
  #body;

  static idSchema = Joi
    .number()
    .integer();

  constructor(id, body)
  {
    this.id = id
    this.body = body
  }

  set id(id)
  {
    this.#id = id;
  }
  get id()
  {
    return this.#id
  }

  set body(body)
  {
    if(!EmployeeBody.isEmployeeBody(body)) throw new Error('Employee body attribute must be EmployeeBody object');
    this.#body = body;
  }

  get body()
  {
    return this.#body
  }

  get bodyId()
  {
    return this.body.id;
  }

  get bodyName()
  {
    return this.body.name;
  }

  toJson()
  {
    return {
      internalId: this.id,
      body: this.body.toJson()
    }
  }

  static isEmployee(object)
  {
    return object instanceof Employee
  }

  static createMultibleEmployeesEntities(employeeData)
  {
    let employees = [];
    for(let employee of employeeData)
    {
      let employeeBody = new EmployeeBody(employee.id, employee.name);
      let newEmployee = new Employee(employee.internal_id, employeeBody);
      employees.push(newEmployee);
    }
    return employees;
  }

  static print(employee)
  {
    if(Employee.isEmployee(employee))
    {
      console.log({id: employee.getId(), body: employee.body.print()})
    }
  }
}