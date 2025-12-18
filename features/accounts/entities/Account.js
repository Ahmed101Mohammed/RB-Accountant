import Joi from "joi";

export class Account
{
  #id;
  #name;
  static idSchema = Joi
    .string()
    .pattern(/^[A-Za-z0-9\-]+$/, 'كود الحساب يحتوي على أرقام وأحرف إنجليزية وعلامة "-" فقط')
    .min(1)
    .max(20)
    .messages({
      'string.min': 'كود الحسب يتكون على الأقل من رقم واحد',
      'string.max': 'أقصى طول لكود الحساب 20 رقما',
      'string.pattern.base': 'كود الحساب يحتوي على أرقام وأحرف فقط'
    })

  static nameSchema = Joi
    .string()
    .pattern(/^[^\d].*$/, 'اسم الحساب يجب أن يبدأ بحرف')
    .min(2)
    .max(100)
    .messages({
      'string.base': 'يجب أن يكون الإسم نصا',
      'string.min': 'يجب أن يحتوي الإسم على حرفان على الأقل',
      'string.max': 'إسم الحساب يجب أن لا يتجاوز 100 حرفا',
      'any.required': 'يجب أن يكون للحساب اسم',
      'string.pattern.base': 'اسم الحساب يجب أن يبدأ بحرف'
    })

  static nameSearchSchema = Joi
  .string()
  .pattern(/^[^\d].*$/, 'اسم الحساب يجب أن يبدأ بحرف')
  .max(100)
  .messages({
    'string.base': 'يجب أن يكون الإسم نصا',
    'string.min': 'يجب أن يحتوي الإسم على حرفان على الأقل',
    'string.max': 'إسم الحساب يجب أن لا يتجاوز 100 حرفا',
    'any.required': 'يجب أن يكون للحساب اسم',
    'string.pattern.base': 'اسم الحساب يجب أن يبدأ بحرف'
  })
  constructor(id, name)
  {
    this.#id = id
    this.#name = name
  }

  getId()
  {
    return this.#id
  }

  getName()
  {
    return this.#name
  }

  toJson()
  {
    return {
      id: this.getId(),
      name: this.getName()
    }
  }

  static isAccount(object)
  {
    return object instanceof Account
  }

  static createMultibleAccountsEntities(accountsData)
  {
    let accounts = [];
    for(let account of accountsData)
    {
      let newAccount = new Account(account.id, account.name)
      accounts.push(newAccount)
    }
    return accounts
  }

  static print(account)
  {
    if(Account.isAccount(account))
    {
      console.log({id: account.getId(), name: account.getName()})
    }
  }
}