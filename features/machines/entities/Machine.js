import Joi from "joi";
import { MachineBody } from "./MachineBody.js";

export class Machine
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
    if(!MachineBody.isMachineBody(body)) throw new Error('Machine body attribute must be MachineBody object');
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

  static isMachine(object)
  {
    return object instanceof Machine
  }

  static createMultibleMachinesEntities(machineData)
  {
    let machines = [];
    for(let machine of machineData)
    {
      let machineBody = new MachineBody(machine.id, machine.name);
      let newMachine = new Machine(machine.internal_id, machineBody);
      machines.push(newMachine);
    }
    return machines;
  }

  static print(machine)
  {
    if(Machine.isMachine(machine))
    {
      console.log({id: machine.getId(), body: machine.body.print()})
    }
  }
}