import { isValid } from "../../../entities/utils/isValid.js";
import { Machine } from "../../machines/entities/Machine.js";
import { Employee } from "../../../entities/employee/Employee.js";

export class LightDetailHead
{
  #machineId = null;
  #employeeId = null;

  constructor(machineId, employeeId)
  {
    this.machineId = machineId;
    this.employeeId = employeeId;
  }

  static isLightDetailHead(object)
  {
    return object instanceof LightDetailHead;
  }

  set machineId(id)
  {
    const isValidId = isValid(Machine.idSchema, id);
    if(!isValidId[0]) throw new Error(isValidId[1].message);
    this.#machineId = id;
  }

  get machineId()
  {
    return this.#machineId;
  }

  set employeeId(id)
  {
    const isValidId = isValid(Employee.idSchema, id);
    if(!isValidId[0]) throw new Error(isValidId[1].message);
    this.#employeeId = id;
  }

  get employeeId()
  {
    return this.#employeeId;
  }

  toJson()
  {
    return {
      machineId: this.machineId,
      employeeId: this.employeeId
    }
  }
}