import Joi from "joi";
import Response from "../utils/Response.js";
import TransactionModel from "../models/Transaction.js";
// import TransactionDBEntity from "../entities/TransactionBody.js";
import Account from "./Account.js";
import AccountModel from "../models/Account.js";
import { currentDate } from "../utils/currentDate.js";
import {TransactionMetaData} from "../entities/transaction/TransactionMetaData.js";
import {ParticipantsList} from "../entities/transaction/ParticipantsList.js";
import {LightParticipant} from "../entities/transaction/LightParticipant.js";
import {ParticipantBody} from "../entities/transaction/ParticipantBody.js";
import {TransactionBody} from "../entities/transaction/TransactionBody.js";
import {Transaction as TransactionEntity} from "../entities/transaction/Transaction.js"
import AccountEntity from "../entities/Account.js";
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
    if(Transaction.isParticipantWith2roles(participants)) throw new Error("Can't compressed participants where there participant with 2 roles");
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
      if(role0[participant.id] === 1 && role1[participant.id] === 1) return true;
    }
    return false;
  }

  static create(transactionData)
  {
    transactionData.comment.trim();
    transactionData.date.trim();

    const schema = Joi.object({
      comment: TransactionMetaData.commentSchema,
      date: TransactionMetaData.dateSchema
      .required(),
      participants: Joi
      .array()
      .min(2)
      .items(Joi
        .object({
          amount: ParticipantBody.amountSchema
            .required(),
          id: LightParticipant.idSchema
            .required(),
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
    let {date, comment, participants} = validationResponse.value;

    if(currentDate() < date)
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
      accountId: accountId.toString().trim(),
      startPeriod: startPeriod.toString().trim(),
      endPeriod: endPeriod.toString().trim()
    }
    const schema = Joi.object({
      accountId: AccountEntity.idSchema.required(),
      startPeriod: TransactionMetaData.dateSchema.required(),
      endPeriod: TransactionMetaData.dateSchema.required()
    })

    const validationResponse = schema.validate(transactionData)
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
      if(!date) return new Response(false, null, 'Accoun has no transactions')
      return new Response(true, null, date)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getAccountTransactionsCount(accountId)
  {
    const accountIdSchema = AccountEntity.idSchema.required();
    const validationResponse = accountIdSchema.validate(accountId);
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    try
    {
      const response = TransactionModel.getAccountTransactionsCount(accountId);
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message);
    }
  }

  static delete(id)
  {
    const transactionId = id.toString().trim();
    const schema = TransactionEntity.idSchema.required();

    const validationResponse = schema.validate(transactionId)
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

  static update(id, transactionData)
  {
    const idSchema = TransactionEntity.idSchema.required();

    transactionData.comment.trim();
    transactionData.date.trim();

    const schema = Joi.object({
      comment: TransactionMetaData.commentSchema,
      date: TransactionMetaData.dateSchema
      .required(),
      participants: Joi
      .array()
      .min(2)
      .items(Joi
        .object({
          amount: ParticipantBody.amountSchema
            .required(),
          id: LightParticipant.idSchema
            .required(),
          role: ParticipantBody.roleSchema
            .required()
        })
      )
    })

    const validationIdResposne = idSchema.validate(id);
    if(validationIdResposne.error) return new Response(false, validationIdResposne.error.message);

    const validationResponse = schema.validate(transactionData)
    if(validationResponse.error) return new Response(false, validationResponse.error.message);
  
    let {date, comment, participants} = validationResponse.value;
    if(currentDate() < date)
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
      const idsString = notExistsAccounts.map(id => `${id}`).join(', ')
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
      const response = TransactionModel.update(id, transactionBody)
      return new Response(true, null,  response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }
}

export default Transaction