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
      id: AccountEntity.idSchema.required(),
      name: AccountEntity.nameSchema.required()
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
      name: AccountEntity.nameSearchSchema
    })

    const validationResponse = schema.validate(userData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    try
    {
      const account = AccountModel.getAccountByName(userData.name)
      if(!account) 
			{
				return new Response(false, `لا يوجد حساب بهذا الإسم ${userData.name}`)
			}
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
      id: AccountEntity.idSchema
    })

    const validationResponse = schema.validate(userData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    try
    {
      const account = AccountModel.getAccountById(id)
      if(!account) 
			{
				return new Response(false, `لا يوجد حساب بهاذا الكود ${id}`)
			}
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
      name: AccountEntity.nameSearchSchema
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
      id: AccountEntity.idSchema
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
      id: AccountEntity.idSchema.required()
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
      id: AccountEntity.idSchema.required(),
      name: AccountEntity.nameSchema.required()
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
