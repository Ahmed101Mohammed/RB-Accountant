import { EmployeeBody } from "../../../entities/employee/EmployeeBody.js";
import { MachineBody } from "../../machines/entities/MachineBody.js";

export class DetailHead
{
  #machineBody = null;
  #employeeBody = null;

  constructor(machineBody, employeeBody)
  {
    this.machineBody = machineBody;
    this.employeeBody = employeeBody;
  }

  static isDetailHead(object)
  {
    return object instanceof DetailHead;
  }

  set machineBody(machineBody)
  {
    if(!MachineBody.isMachineBody(machineBody)) throw new Error('DetailHead Error: machineBody property expect to be MachineBody object');
    this.#machineBody = machineBody;
  }

  get machineBody()
  {
    return this.#machineBody;
  }

  set employeeBody(employeeBody)
  {
    if(!EmployeeBody.isEmployeeBody(employeeBody)) throw new Error('DetailHead Error: employeeBody property expect to be MachineBody object');
    this.#employeeBody = employeeBody;
  }

  get employeeBody()
  {
    return this.#employeeBody;
  }

  static createDetailHeadForReading(detail)
  {
    const machineBody = new MachineBody(detail.machineId, detail.machineName);
    const employeeBody = new EmployeeBody(detail.employeeId, detail.employeeName);
    return new DetailHead(machineBody, employeeBody);
  }

  toJson()
  {
    return {
      machine: this.machineBody.toJson(),
      employee: this.employeeBody.toJson()
    }
  }
}