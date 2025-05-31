import Joi from "joi";
import Response from "../utils/Response.js";
import TransactionModel from "../models/Transaction.js";
import TransactionDBEntity from "../entities/TransactionBody.js";
import Account from "./Account.js";
import AccountModel from "../models/Account.js";
import { currentDate } from "../utils/currentDate.js";
import TransactionMetaData from "../entities/transaction/TransactionMetaData.js";
import ParticipantsList from "../entities/transaction/ParticipantsList.js";
import LightParticipant from "../entities/transaction/LightParticipant.js";
import ParticipantBody from "../entities/transaction/ParticipantBody.js";
import TransactionBody from "../entities/transaction/TransactionBody.js";

class Transaction
{
  static transactionBalance(participants)
  {
    let compressedParticipants = Transaction.compressedParticipants(participants)
    let balance = 0;
    for(let participant of compressedParticipants)
    {
      if(participant.role === 1) balance -= participant.amount
      if(participant.role === 0) balance += participant.amount
    }

    if(balance <= -0.01 || balance >= 0.01) return balance;
    return 0;
  }

  static compressedParticipants(participants)
  {
    // [ {amount, role, code} ]
    if(!Transaction.isParticipantWith2roles(participants)) throw new Error("Can't compressed participants where there participant with 2 roles");
    let role0 = {};
    let role1 = {};
    for(let participant of participants)
    {
      if(participant.role === 0)
      {
        role0[participant.id] = role0[participant.id]
          ? role0[participant.id] + participant.amount
          : participant.amount
      }
      else if(participant.role === 1)
      {
        role1[participant.id] = role1[participant.id]
          ? role1[participant.id] + participant.amount
          : participant.amount
      }
    }

    let compressedParticipants = [];
    for(let [k, v] of Object.entries(role0))
    {
      compressedParticipants.push({id: k, role: 0, amount: v})
    }
    for(let [k, v] of Object.entries(role1))
    {
      compressedParticipants.push({id: k, role: 1, amount: v})
    }

    return compressedParticipants;
  }

  static isParticipantWith2roles(participants)
  {
    let role0 = {};
    let role1 = {};
    for(let participant of participants)
    {
      if(participant.role === 0) role0[participant.id] = 1;
      if(participant.role === 1) role1[participant.id] = 1;
      if(role0[participant.id] && role1[participant.id]) return true;
    }
    return false;
  }

  static create(date, comment, participants)
  {
    const transactionData = {
      comment: comment.trim(),
      date: date.trim(),
      participants
    }

    const schema = Joi.object({
      comment: TransactionMetaData.commentSchema
        .messages({
          'string.base': 'يجب أن يكون البيان نصا',
          'string.max': 'يجب اللا يتجاوز البيان 150 حرفا'
        }),
      date: TransactionMetaData.dateSchema
      .required()
      .messages({
        'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
        'string.empty': 'حقل التاريخ مطلوب',
        'any.required': 'هذا الحقل مطلوب'
      }),
      participants: Joi
      .array()
      .min(2)
      .items(Joi
        .object({
          amount: ParticipantBody.amountSchema
            .required(),
          id: LightParticipant.idSchema
            .required()
            .messages({
              'string.min': 'كود الحسب يتكون على الأقل من رقم واحد',
              'string.max': 'أقصى طول لكود الحساب 20 رقما',
              'any.required': 'يجب أن يكون للحساب كود',
              'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط'
            }),
          role: ParticipantBody.roleSchema
            .required()
        })
      )
    })

    const validationResponse = schema.validate(transactionData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    if(currentDate < date)
    {
      return new Response(false, 'لا يمكن إنشاء معاملة بتاريخ في المستقبل')
    }

    if(date < '0001-01-01')
    {
      return new Response(false, 'لا يمكن إنشاء معاملة بتاريخ قبل الميلاد')
    }

    if(Transaction.isParticipantWith2roles(participants))
    {
      return new Response(false, 'لا يمكن لحساب أن يكون دائنا ومدينا في نفس المعاملة')
    }

    const balance = Transaction.transactionBalance(participants)
    if(balance !== 0)
    {
      let response = balance > 0 
        ? new Response(false, `${balance} ` + 'هنالك زيادة في مبلغ المدينين عن الدائنين بقدر')
        : new Response(false, `${balance*-1} ` + 'هنالك زيادة في مبلغ الدائنين عن المدينين بقدر')
      return response;
    }
    
    // build a function to check that all debtors and creditors accounts are exists.
    const ids = participants.map(participant => participant.id);
    const notExistsAccounts = AccountModel.getMissingIds(ids)

    if(notExistsAccounts.length !== 0)
    {
      const idsString = notExistsAccounts.map(id => `$id`).join(', ')
      return new Response(false, `لا يوجد حسابات بهذه الأكواد: ${idsString}`)
    }

    const transactionMetaData = new TransactionMetaData(date, comment)
    const participantList = new ParticipantsList()
    for(let participant of participants)
    {
      let participantBody = new ParticipantBody(participant.role, participant.amount)
      let lightParticipant = new LightParticipant(participant.id, participantBody)
      participantList.push(lightParticipant)
    }

    const transactionBody = new TransactionBody(transactionMetaData, participantList)
    try
    {
      const response = TransactionModel.create(transactionBody)
      return new Response(true, null,  response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }
  
  static getAllTransactions()
  {
    try
    {
      const response = TransactionModel.getAllTransactions()
      if(!response) return new Response(false, null, 'Failed to get transactions data')
      return new Response(true, null, response)
    }
    catch(error)
    {
      console.log({error})
      return new Response(false, error.message)
    }
  }

  static getTransactionById(id)
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
      const transaction = TransactionModel.getTransactionById(id)
      if(!transaction) return new Response(false, `لا يوجد معاملة بهاذا الكود ${id}`)
      return new Response(true, null, transaction)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getAllTransactionsWithPaging(page)
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
      const data = TransactionModel.getAllTransactionsWithPaging(page)
      return new Response(true, null, data)
    }
    catch(e)
    {
      return new Response(false, e.message)
    }
  }

  static getAllTransactionsForSpecificPeriod(startPeriod, endPeriod)
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
      const transactions = TransactionModel.getAllTransactionsForSpecificPeriod(startPeriod, endPeriod)
      return new Response(true, null, transactions)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }


  static getAllTransactionsForAccountForPeriod(accountId, startPeriod, endPeriod)
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

    const response = Account.getAccountById(accountId)

    if(!response.getState())
    {
      return new Response(false, `لا يوجد حساب بهذا الكود ${debtorId}`)
    }

    try
    {
      const transactions = TransactionModel.getAllTransactionsForAccountForPeriod(accountId, startPeriod, endPeriod)
      return new Response(true, null, transactions)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }
  static getAcccountStatementForSpecificPeriod(accountId, startPeriod, endPeriod)
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

    const response = Account.getAccountById(accountId)

    if(!response.getState())
    {
      return new Response(false, `لا يوجد حساب بهذا الكود ${debtorId}`)
    }

    try
    {
      const transactions = TransactionModel.getAcccountStatementForSpecificPeriod(accountId, startPeriod, endPeriod)
      return new Response(true, null, transactions)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getAllTransactionsForAccount(accountId)
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

    const response = Account.getAccountById(accountId)

    if(!response.getState())
    {
      return new Response(false, `لا يوجد حساب بهذا الكود ${debtorId}`)
    }

    try
    {
      const transactions = TransactionModel.getAllTransactionsForAccount(accountId)
      return new Response(true, null, transactions)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getAccountBalanceAtStartPeriod(accountId, startPeriod)
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

    const response = Account.getAccountById(accountId)

    if(!response.getState())
    {
      return new Response(false, `لا يوجد حساب بهذا الكود ${debtorId}`)
    }

    try
    {
      const balance = TransactionModel.getAccountBalanceAtStartPeriod(accountId, startPeriod)
      return new Response(true, null, balance)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getFirstTransactionDateOfAccount(accountId)
  {
    const userData = {
      accountId: accountId.trim(),
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

    const validationResponse = schema.validate(userData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    const response = Account.getAccountById(accountId)

    if(!response.getState())
    {
      return new Response(false, `لا يوجد حساب بهذا الكود ${accountId}`)
    }

    try
    {
      const date = TransactionModel.getFirstTransactionDateOfAccount(accountId)
      if(!date) return new Response(false, null, 'Accoun has no transactions')
      return new Response(true, null, date)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getLastTransactionDateOfAccount(accountId)
  {
    const userData = {
      accountId: accountId.trim(),
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

    const validationResponse = schema.validate(userData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    const response = Account.getAccountById(accountId)

    if(!response.getState())
    {
      return new Response(false, `لا يوجد حساب بهذا الكود ${accountId}`)
    }

    try
    {
      const date = TransactionModel.getLastTransactionDateOfAccount(accountId)
      console.log(date)
      if(!date) return new Response(false, null, 'Accoun has no transactions')
      return new Response(true, null, date)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static delete(id)
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
      const response = TransactionModel.delete(id)
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static update(transactionId, amount, debtorId, creditorId, comment, date)
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

    const debtorAccountResponse = Account.getAccountById(debtorId)

    if(!debtorAccountResponse.getState())
    {
      return new Response(false, `لا يوجد حساب لمدين بهذا الكود ${debtorId}`)
    }

    const creditorAccountResponse = Account.getAccountById(creditorId)
    if(!creditorAccountResponse.getState())
    {
      return new Response(false, `لا يوجد حساب لدائن بهذا الكود ${creditorId}`)
    }

    const transictionDBEntity = new TransactionDBEntity(amount, debtorId, creditorId, comment, date) 
    try
    {
      const response = TransactionModel.update(transactionId, transictionDBEntity)
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }
}

export default Transaction