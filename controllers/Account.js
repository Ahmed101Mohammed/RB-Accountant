import Joi from "joi";
import Response from "../utils/Response.js";
import AccountEntity from "../entities/Account.js";
import AccountModel from "../models/Account.js";
class Account
{
  static create(id, name)
  {
    const userData = {
      id: id.trim(),
      name: name.trim()
    }
    const schema = Joi.object({
      id: Joi
        .string()
        .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
        .min(1)
        .max(20)
        .required()
        .messages({
          'string.min': 'كود الحسب يتكون على الأقل من رقم واحد',
          'string.max': 'أقصى طول لكود الحساب 20 رقما',
          'any.required': 'يجب أن يكون للحساب كود',
          'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط'
        }),
      name: Joi
        .string()
        .pattern(/^[^\d].*$/, 'اسم الحساب يجب أن يبدأ بحرف')
        .min(2)
        .max(100)
        .required()
        .messages({
          'string.base': 'يجب أن يكون الإسم نصا',
          'string.min': 'يجب أن يحتوي الإسم على حرفان على الأقل',
          'string.max': 'إسم الحساب يجب أن لا يتجاوز 100 حرفا',
          'any.required': 'يجب أن يكون للحساب اسم',
          'string.pattern.base': 'اسم الحساب يجب أن يبدأ بحرف'
        })
    })

    const validationResponse = schema.validate(userData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    const newAccount = new AccountEntity(userData.id, userData.name)
    try
    {
      const response = AccountModel.create(newAccount)
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }
  
  static getAllAccounts()
  {
    try
    {
      const accounts = AccountModel.getAllAccounts()
      return new Response(true, null, accounts)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getAccountByName(name)
  {
    const userData = {
      name: name.trim()
    }

    const schema = Joi.object({
      name: Joi
        .string()
        .pattern(/^[^\d].*$/, 'اسم الحساب يجب أن يبدأ بحرف')
        .max(100)
        .messages({
          'string.max': 'إسم الحساب يجب أن لا يتجاوز 100 حرفا'
        })
    })

    const validationResponse = schema.validate(userData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    try
    {
      const account = AccountModel.getAccountByName(userData.name)
      if(!account) return new Response(false, `لا يوجد حساب بهذا الإسم ${userData.name}`)
      return new Response(true, null, account)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getAccountById(id)
  {
    const userData = {
      id: id.trim(),
    }
    const schema = Joi.object({
      id: Joi
        .string()
        .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
        .max(20)
        .messages({
          'string.max': 'أقصى طول لكود الحساب 20 رقما',
          'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط',
        }),
    })

    const validationResponse = schema.validate(userData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    try
    {
      const account = AccountModel.getAccountById(id)
      if(!account) return new Response(false, `لا يوجد حساب بهاذا الكود ${id}`)
      return new Response(true, null, account)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getAccountsItsNameContain(partialName)
  {
    const userData = {
      name: partialName
    }

    const schema = Joi.object({
      name: Joi
        .string()
        .max(100)
        .messages({
          'string.max': 'إسم الحساب يجب أن لا يتجاوز 100 حرفا'
        })
    })

    const validationResonse = schema.validate(userData)
    if(validationResonse.error)
    {
      return new Response(false, validationResonse.error.message)
    }

    try
    {
      const accounts = AccountModel.getAccountsItsNameContain(partialName)
      return new Response(true, null, accounts)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getAccountsItsIdContain(partialId)
  {
    const userData = {
      id: partialId
    }

    const schema = Joi.object({
      id: Joi
        .string()
        .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
        .max(20)
        .messages({
          'string.max': 'أقصى طول لكود الحساب 20 رقما',
          'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط',
        }),
    })

    const validationResonse = schema.validate(userData)
    if(validationResonse.error)
    {
      return new Response(false, validationResonse.error.message)
    }

    try
    {
      const accounts = AccountModel.getAccountsItsIdContain(partialId)
      return new Response(true, null, accounts)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static delete(id)
  {
    const userData = {
      id: id.trim()
    }
    const schema = Joi.object({
      id: Joi
        .string()
        .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
        .min(1)
        .max(20)
        .required()
        .messages({
          'string.min': 'كود الحسب يتكون على الأقل من رقم واحد',
          'string.max': 'أقصى طول لكود الحساب 20 رقما',
          'any.required': 'يجب أن يكون للحساب كود',
          'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط'
        })
    })

    const validationResponse = schema.validate(userData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }
    try
    {
      const response = AccountModel.delete(id)
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static update(id, name)
  {
    const userData = {
      id: id.trim(),
      name: name.trim()
    }
    const schema = Joi.object({
      id: Joi
        .string()
        .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
        .min(1)
        .max(20)
        .required()
        .messages({
          'string.min': 'كود الحسب يتكون على الأقل من رقم واحد',
          'string.max': 'أقصى طول لكود الحساب 20 رقما',
          'any.required': 'يجب أن يكون للحساب كود',
          'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط'
        }),
      name: Joi
        .string()
        .pattern(/^[^\d].*$/, 'اسم الحساب يجب أن يبدأ بحرف')
        .min(2)
        .max(100)
        .required()
        .messages({
          'string.base': 'يجب أن يكون الإسم نصا',
          'string.min': 'يجب أن يحتوي الإسم على حرفان على الأقل',
          'string.max': 'إسم الحساب يجب أن لا يتجاوز 100 حرفا',
          'any.required': 'يجب أن يكون للحساب اسم',
          'string.pattern.base': 'اسم الحساب يجب أن يبدأ بحرف'
        })
    })

    const validationResponse = schema.validate(userData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    const updatedAccount = new AccountEntity(userData.id, userData.name)
    try
    {
      const response = AccountModel.update(updatedAccount)
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }
}

export default Account