import Joi from "joi";

export class MachineBody
{
  #id;
  #name;

  static idSchema = Joi
    .string()
    .pattern(/^[A-Za-z0-9\-]+$/, 'كود الماكنة يحتوي على أرقام وأحرف إنجليزية وعلامة "-" فقط')
    .min(1)
    .max(20)
    .messages({
      'string.min': 'كود الماكينة يتكون على الأقل من رقم واحد',
      'string.max': 'أقصى طول لكود الماكينة 20 رقما',
      'string.pattern.base': 'كود الماكينة يحتوي على أرقام وأحرف إنجليزية فقط'
    })

  static nameSchema = Joi
    .string()
    .pattern(/^[^\d].*$/, 'اسم الماكينة يجب أن يبدأ بحرف')
    .min(2)
    .max(100)
    .messages({
      'string.base': 'يجب أن يكون الإسم نصا',
      'string.min': 'يجب أن يحتوي الإسم على حرفان على الأقل',
      'string.max': 'إسم الماكينة يجب أن لا يتجاوز 100 حرفا',
      'any.required': 'يجب أن يكون للماكينة اسم',
      'string.pattern.base': 'اسم الماكينة يجب أن يبدأ بحرف'
    });

    static nameSearchSchema = Joi
    .string()
    .pattern(/^[^\d].*$/, 'اسم الماكينة يجب أن يبدأ بحرف')
    .max(100)
    .messages({
      'string.base': 'يجب أن يكون الإسم نصا',
      'string.max': 'إسم الماكينة يجب أن لا يتجاوز 100 حرفا',
      'any.required': 'يجب أن يكون للماكينة اسم',
      'string.pattern.base': 'اسم الماكينة يجب أن يبدأ بحرف'
    });
      
  constructor(id, name)
  {
    this.id = id
    this.name = name
  }

  set id(id)
  {
    this.#id = id;
  }
  get id()
  {
    return this.#id
  }

  set name(name)
  {
    return this.#name = name;
  }
  get name()
  {
    return this.#name
  }

  toJson()
  {
    return {
      id: this.id,
      name: this.name
    }
  }

  static isMachineBody(object)
  {
    return object instanceof MachineBody
  }

  static createMultibleMachineBodysEntities(machinesBodysData)
  {
    let machinesBodys = [];
    for(let machineBody of machinesBodysData)
    {
      let newMachineBody = new MachineBody(machineBody.id, machineBody.name);
      machinesBodys.push(newMachineBody);
    }
    return machinesBodys;
  }

  static print(machineBody)
  {
    if(MachineBody.isMachineBody(machineBody))
    {
      console.log({id: machineBody.getId(), name: machineBody.getName()})
    }
  }
}