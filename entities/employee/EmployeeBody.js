import Joi from "joi";

export class EmployeeBody
{
  #id;
  #name;

  static idSchema = Joi
    .string()
    .pattern(/^[A-Za-z0-9\-]+$/, 'كود الموظف يحتوي على أرقام وأحرف إنجليزية وعلامة "-" فقط')
    .min(1)
    .max(20)
    .messages({
      'string.min': 'كود الموظف يتكون على الأقل من رقم واحد',
      'string.max': 'أقصى طول لكود الموظف 20 رقما',
      'string.pattern.base': 'كود الموظف يحتوي على أرقام وأحرف إنجليزية فقط'
    })

  static nameSchema = Joi
    .string()
    .pattern(/^[^\d].*$/, 'اسم الموظف يجب أن يبدأ بحرف')
    .min(2)
    .max(100)
    .messages({
      'string.base': 'يجب أن يكون الإسم نصا',
      'string.min': 'يجب أن يحتوي الإسم على حرفان على الأقل',
      'string.max': 'إسم الموظف يجب أن لا يتجاوز 100 حرفا',
      'any.required': 'يجب أن يكون للموظف اسم',
      'string.pattern.base': 'اسم الموظف يجب أن يبدأ بحرف'
    });
      
  static nameSearchSchema = Joi
    .string()
    .pattern(/^[^\d].*$/, 'اسم الموظف يجب أن يبدأ بحرف')
    .max(100)
    .messages({
      'string.base': 'يجب أن يكون الإسم نصا',
      'string.max': 'إسم الموظف يجب أن لا يتجاوز 100 حرفا',
      'any.required': 'يجب أن يكون للموظف اسم',
      'string.pattern.base': 'اسم الموظف يجب أن يبدأ بحرف'
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

  static isEmployeeBody(object)
  {
    return object instanceof EmployeeBody
  }

  static createMultibleEmployeeBodysEntities(employeesBodysData)
  {
    let employeesBodys = [];
    for(let employeeBody of employeesBodysData)
    {
      let newEmployeeBody = new EmployeeBody(employeeBody.id, employeeBody.name);
      employeesBodys.push(newEmployeeBody);
    }
    return employeesBodys;
  }

  static print(employeeBody)
  {
    if(EmployeeBody.isEmployeeBody(employeeBody))
    {
      console.log({id: employeeBody.getId(), name: employeeBody.getName()})
    }
  }
}