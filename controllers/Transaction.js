import Joi from "joi";
import Response from "../utils/Response.js";
import TransactionModel from "../models/Transaction.js";
import TransactionDBEntity from "../entities/TransactionDBEntity.js";
import Account from "./Account.js";

class Transaction
{
  static async create(amount, debtorId, creditorId, comment, date)
  {
    const transactionData = {
      amount,
      debtorId: debtorId.trim(),
      creditorId: creditorId.trim(),
      comment: comment.trim(),
      date: date.trim(),
    }
    const schema = Joi.object({
      amount: Joi
        .number()
        .precision(2)
        .required()
        .min(0.01)
        .messages({
          'number.base': 'مبلغ لبمعاملة يجب أن يكون رقما',
          'number.precision': 'لا يسمح بأجزاء من ألف لمبلغ المعاملة',
          'number.min': 'أقل مبلغ للمعاملة قرش واحد',
          'any.required': 'يجب أن يكون للمعاملة مبلغ محدد'
        }),
      debtorId: Joi
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
      creditorId: Joi
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
      comment: Joi
        .string()
        .max(150)
        .allow('')
        .messages({
          'string.base': 'يجب أن يكون الإسم نصا',
          'string.max': 'إسم الحساب يجب أن لا يتجاوز 150 حرفا',
          'any.required': 'يجب أن يكون للحساب اسم',
        }),
      date: Joi
      .string()
      .pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd')
      .required()
      .messages({
        'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
        'string.empty': 'حقل التاريخ مطلوب',
        'any.required': 'هذا الحقل مطلوب'
      })
    })

    const validationResponse = schema.validate(transactionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    if(debtorId === creditorId)
    {
      return new Response(false, "لا يسمح بأن يكون الدائن والمدان نفس الحساب")
    }

    const debtorAccountResponse = await Account.getAccountById(debtorId)

    if(!debtorAccountResponse.getState())
    {
      return new Response(false, `لا يوجد حساب لمدين بهذا الكود ${debtorId}`)
    }

    const creditorAccountResponse = await Account.getAccountById(creditorId)
    if(!creditorAccountResponse.getState())
    {
      return new Response(false, `لا يوجد حساب لدائن بهذا الكود ${creditorId}`)
    }

    const newTransactionDBEntity = new TransactionDBEntity(amount, debtorId, creditorId, comment, date)
    try
    {
      const response = await TransactionModel.create(newTransactionDBEntity)
      return new Response(true, null,  response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }
  
  static async getAllTransactions()
  {
    try
    {
      const response = await TransactionModel.getAllTransactions()
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static async getTransactionById(id)
  {
    const userData = {
      id
    }
    const schema = Joi.object({
      id: Joi
        .number()
        .integer()
        .min(0)
    })

    const validationResponse = schema.validate(userData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    try
    {
      const transaction = await TransactionModel.getTransactionById(id)
      if(!transaction) return new Response(false, `لا يوجد معاملة بهاذا الكود ${id}`)
      return new Response(true, null, transaction)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static async getAllTransactionsWithPaging(page)
  {
    const userData = {page}
    const schema = Joi.object({
      page: Joi
        .number()
        .integer()
        .min(0)
        .required()
    })

    const validationResonse = schema.validate(userData)
    if(validationResonse.error) return new Response(false, validationResonse.error.message)
    try
    {
      const data = await TransactionModel.getAllTransactionsWithPaging(page)
      return new Response(true, null, data)
    }
    catch(e)
    {
      return new Response(false, e.message)
    }
  }

  static async getAllTransactionsForSpecificPeriod(startPeriod, endPeriod)
  {
    const transactionData = {
      startPeriod: startPeriod.trim(),
      endPeriod: endPeriod.trim()
    }

    const schema = Joi.object({
      startPeriod: Joi
        .string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd')
        .min(10)
        .max(10)
        .required()
        .messages({
          'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
          'string.empty': 'حقل التاريخ مطلوب',
          'any.required': 'هذا الحقل مطلوب'
        }),
      endPeriod: Joi
        .string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd')
        .min(10)
        .max(10)
        .required()
        .messages({
          'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
          'string.empty': 'حقل التاريخ مطلوب',
          'any.required': 'هذا الحقل مطلوب'
        })
    })

    const validationResponse = schema.validate(transactionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    try
    {
      const transactions = await TransactionModel.getAllTransactionsForSpecificPeriod(startPeriod, endPeriod)
      return new Response(true, null, transactions)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }


  static async getAllTransactionsForAccountForPeriod(accountId, startPeriod, endPeriod)
  {
    const transactionData = {
      accountId: accountId.trim(),
      startPeriod: startPeriod.trim(),
      endPeriod: endPeriod.trim()
    }
    const schema = Joi.object({
      accountId: Joi
        .string()
        .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
        .required()
        .max(20)
        .messages({
          'string.max': 'أقصى طول لكود الحساب 20 رقما',
          'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط',
        }),
        startPeriod: Joi
        .string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd')
        .min(10)
        .max(10)
        .required()
        .messages({
          'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
          'string.empty': 'حقل التاريخ مطلوب',
          'any.required': 'هذا الحقل مطلوب'
        }),
      endPeriod: Joi
        .string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd')
        .min(10)
        .max(10)
        .required()
        .messages({
          'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
          'string.empty': 'حقل التاريخ مطلوب',
          'any.required': 'هذا الحقل مطلوب'
        })
    })

    const validationResponse = schema.validate(transactionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    const response = await Account.getAccountById(accountId)

    if(!response.getState())
    {
      return new Response(false, `لا يوجد حساب بهذا الكود ${debtorId}`)
    }

    try
    {
      const transactions = await TransactionModel.getAllTransactionsForAccountForPeriod(accountId, startPeriod, endPeriod)
      return new Response(true, null, transactions)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }
  static async getAcccountStatementForSpecificPeriod(accountId, startPeriod, endPeriod)
  {
    const transactionData = {
      accountId: accountId.trim(),
      startPeriod: startPeriod.trim(),
      endPeriod: endPeriod.trim()
    }
    const schema = Joi.object({
      accountId: Joi
        .string()
        .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
        .required()
        .max(20)
        .messages({
          'string.max': 'أقصى طول لكود الحساب 20 رقما',
          'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط',
        }),
        startPeriod: Joi
        .string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd')
        .min(10)
        .max(10)
        .required()
        .messages({
          'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
          'string.empty': 'حقل التاريخ مطلوب',
          'any.required': 'هذا الحقل مطلوب'
        }),
      endPeriod: Joi
        .string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd')
        .min(10)
        .max(10)
        .required()
        .messages({
          'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
          'string.empty': 'حقل التاريخ مطلوب',
          'any.required': 'هذا الحقل مطلوب'
        })
    })

    const validationResponse = schema.validate(transactionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    const response = await Account.getAccountById(accountId)

    if(!response.getState())
    {
      return new Response(false, `لا يوجد حساب بهذا الكود ${debtorId}`)
    }

    try
    {
      const transactions = await TransactionModel.getAcccountStatementForSpecificPeriod(accountId, startPeriod, endPeriod)
      return new Response(true, null, transactions)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static async getAllTransactionsForAccount(accountId)
  {
    const transactionData = {
      accountId: accountId.trim()
    }
    const schema = Joi.object({
      accountId: Joi
        .string()
        .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
        .required()
        .max(20)
        .messages({
          'string.max': 'أقصى طول لكود الحساب 20 رقما',
          'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط',
        })
    })

    const validationResponse = schema.validate(transactionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    const response = await Account.getAccountById(accountId)

    if(!response.getState())
    {
      return new Response(false, `لا يوجد حساب بهذا الكود ${debtorId}`)
    }

    try
    {
      const transactions = await TransactionModel.getAllTransactionsForAccount(accountId)
      return new Response(true, null, transactions)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static async getAccountBalanceAtStartPeriod(accountId, startPeriod)
  {
    const transactionData = {
      accountId: accountId.trim(),
      startPeriod: startPeriod.trim(),
    }
    const schema = Joi.object({
      accountId: Joi
        .string()
        .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
        .required()
        .max(20)
        .messages({
          'string.max': 'أقصى طول لكود الحساب 20 رقما',
          'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط',
        }),
        startPeriod: Joi
        .string()
        .pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd')
        .min(10)
        .max(10)
        .required()
        .messages({
          'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
          'string.empty': 'حقل التاريخ مطلوب',
          'any.required': 'هذا الحقل مطلوب'
        })
    })

    const validationResponse = schema.validate(transactionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    const response = await Account.getAccountById(accountId)

    if(!response.getState())
    {
      return new Response(false, `لا يوجد حساب بهذا الكود ${debtorId}`)
    }

    try
    {
      const balance = await TransactionModel.getAccountBalanceAtStartPeriod(accountId, startPeriod)
      return new Response(true, null, balance)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static async delete(id)
  {
    const transactionData = {id: id.toString()}
    const schema = Joi.object({
      id: Joi
        .string()
        .pattern(/^\d+$/, 'كود العملية يحتوي على أرقام فقط')
        .min(1)
        .required()
        .messages({
          'string.min': 'يجب أن يتكون كود المعاملة على رقم واحد على الأقل',
          'any.required': 'يجب أن يكون للعملية كود',
          'string.pattern.base': 'كود العملية يحتوي على أرقام فقط'
        })
    })

    const validationResponse = schema.validate(transactionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }
    try
    {
      const response = await TransactionModel.delete(id)
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static async update(transactionId, amount, debtorId, creditorId, comment, date)
  {
    const transactionData = {
      transactionId: transactionId.toString(),
      amount,
      debtorId: debtorId.trim(),
      creditorId: creditorId.trim(),
      comment: comment.trim(),
      date: date.trim(),
    }
    const schema = Joi.object({
      transactionId: Joi
        .string()
        .pattern(/^\d+$/, 'كود العملية يحتوي على أرقام فقط')
        .required()
        .min(1)
        .messages({
          'string.min': 'لا يوجد كود عملية بالسالب',
          'string.pattern.base': 'كود العملية يحتوي على أرقام فقط'
        }),
      amount: Joi
        .number()
        .precision(2)
        .required()
        .min(0.01)
        .messages({
          'number.base': 'مبلغ لبمعاملة يجب أن يكون رقما',
          'number.precision': 'لا يسمح بأجزاء من ألف لمبلغ المعاملة',
          'number.min': 'أقل مبلغ للمعاملة قرش واحد'
        }),
      debtorId: Joi
        .string()
        .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
        .min(1)
        .required()
        .max(20)
        .messages({
          'string.min': 'كود الحسب يتكون على الأقل من رقم واحد',
          'string.max': 'أقصى طول لكود الحساب 20 رقما',
          'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط'
        }),
      creditorId: Joi
        .string()
        .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
        .min(1)
        .max(20)
        .required()
        .messages({
          'string.min': 'كود الحسب يتكون على الأقل من رقم واحد',
          'string.max': 'أقصى طول لكود الحساب 20 رقما',
          'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط'
        }), 
      comment: Joi
        .string()
        .max(150)
        .allow("")
        .messages({
          'string.base': 'يجب أن يكون الإسم نصا',
          'string.max': 'إسم الحساب يجب أن لا يتجاوز 150 حرفا'
        }),
      date: Joi
      .string()
      .required()
      .pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd')
      .min(10)
      .max(10)
      .messages({
        'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
        'string.empty': 'حقل التاريخ مطلوب',
        'any.required': 'هذا الحقل مطلوب'
      })
    })

    const validationResponse = schema.validate(transactionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    if(debtorId === creditorId)
    {
      return new Response(false, "لا يسمح بأن يكون الدائن والمدان نفس الحساب")
    }

    const debtorAccountResponse = await Account.getAccountById(debtorId)

    if(!debtorAccountResponse.getState())
    {
      return new Response(false, `لا يوجد حساب لمدين بهذا الكود ${debtorId}`)
    }

    const creditorAccountResponse = await Account.getAccountById(creditorId)
    if(!creditorAccountResponse.getState())
    {
      return new Response(false, `لا يوجد حساب لدائن بهذا الكود ${creditorId}`)
    }

    const transictionDBEntity = new TransactionDBEntity(amount, debtorId, creditorId, comment, date) 
    try
    {
      const response = await TransactionModel.update(transactionId, transictionDBEntity)
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }
}

export default Transaction