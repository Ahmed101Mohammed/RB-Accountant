import Joi from "joi";

export class ItemBody
{
  #id;
  #name;

  static idSchema = Joi
    .string()
    .pattern(/^[A-Za-z0-9]+$/, 'كود الصنف يحتوي على أرقام وأحرف إنجليزية فقط')
    .min(1)
    .max(20)
    .messages({
      'string.min': 'كود الصنف يتكون على الأقل من رقم واحد',
      'string.max': 'أقصى طول لكود الصنف 20 رقما',
      'string.pattern.base': 'كود الصنف يحتوي على أرقام وأحرف إنجليزية فقط'
    })

  static nameSchema = Joi
    .string()
      .pattern(/^[^\d].*$/, 'اسم الصنف يجب أن يبدأ بحرف')
      .min(2)
      .max(100)
      .messages({
        'string.base': 'يجب أن يكون الإسم نصا',
        'string.min': 'يجب أن يحتوي الإسم على حرفان على الأقل',
        'string.max': 'إسم الصنف يجب أن لا يتجاوز 100 حرفا',
        'any.required': 'يجب أن يكون للصنف اسم',
        'string.pattern.base': 'اسم الصنف يجب أن يبدأ بحرف'
      });

  static nameSearchSchema = Joi
    .string()
    .pattern(/^[^\d].*$/, 'اسم الصنف يجب أن يبدأ بحرف')
    .max(100)
    .messages({
      'string.base': 'يجب أن يكون الإسم نصا',
      'string.max': 'إسم الصنف يجب أن لا يتجاوز 100 حرفا',
      'any.required': 'يجب أن يكون للصنف اسم',
      'string.pattern.base': 'اسم الصنف يجب أن يبدأ بحرف'
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

  static isItemBody(object)
  {
    return object instanceof ItemBody
  }

  static createMultibleItemBodysEntities(itemsBodysData)
  {
    let itemsBodys = [];
    for(let itemBody of itemsBodysData)
    {
      let newItemBody = new ItemBody(itemBody.id, itemBody.name);
      itemsBodys.push(newItemBody);
    }
    return itemsBodys;
  }

  static print(itemBody)
  {
    if(ItemBody.isItemBody(itemBody))
    {
      console.log({id: itemBody.getId(), name: itemBody.getName()})
    }
  }
}