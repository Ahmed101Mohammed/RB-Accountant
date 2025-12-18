import { isValid } from "../utils/isValid.js";
import Joi from "joi";
import {TransactionBody} from "./TransactionBody.js";
import { TransactionMetaData } from "./TransactionMetaData.js";
import { ParticipantsList } from "./ParticipantsList.js";
import { Participant } from "./Participant.js";
import { ParticipantBody } from "./ParticipantBody.js";
import {Account} from "../../features/accounts/entities/Account.js";

export class Transaction
{
  #id;
  #body;
  static idSchema = Joi
    .string()
    .pattern(/^\d+$/, 'كود العملية يحتوي على أرقام فقط')
    .min(1)
    .messages({
      'string.min': 'يجب أن يتكون كود المعاملة على رقم واحد على الأقل',
      'any.required': 'يجب أن يكون للعملية كود',
      'string.pattern.base': 'كود العملية يحتوي على أرقام فقط'
    })
  constructor(id, transactionBody)
  {
    this.setId(id);
    this.setTransactionBody(transactionBody);
  }

  setId(id)
  {
    id = id.toString().trim()
    const schema = Transaction.idSchema.required();
    const isValidId = isValid(schema, id)
    if(!isValidId[0]) throw new Error(isValidId[1].message)
    this.#id = isValidId[1];
  }

  setTransactionBody(body)
  {
    if(!TransactionBody.isTransactionBody(body)) throw new Error(`Transaction body expect to be TransactionBody object`)
    this.#body = body
  }

  static isTransaction(object)
  {
    return object instanceof Transaction
  }

  getId()
  {
    return this.#id
  }

  getBody()
  {
    return this.#body
  }

  toJson()
  {
    return {
      id: this.getId(),
      body: this.getBody().toJson(),
    }
  }
  // [{id, date, comment, amount, account_id, account_name, role, detail_id},...]
  static createMultipleTransactions(transactions)
  {
    let transactionsEntities = [];
    let transactionId = transactions[0].id;
    let transactionDate = transactions[0].date;
    let transactionComment = transactions[0].comment;
    let metaData = new TransactionMetaData(transactionDate, transactionComment);
    let participantsList = new ParticipantsList();

    for(let transaction of transactions)
    {
      if(transaction.id !== transactionId)
      {
        let transactionBody = new TransactionBody(metaData, participantsList);
        let newTransaction = new Transaction(transactionId, transactionBody);
        transactionsEntities.push(newTransaction);

        transactionId = transaction.id;
        transactionDate = transaction.date;
        transactionComment = transaction.comment;
        metaData = new TransactionMetaData(transactionDate, transactionComment);
        participantsList = new ParticipantsList();
      }

      let account = new Account(transaction.account_id, transaction.account_name);
      let participantBody = new ParticipantBody(transaction.role, transaction.amount);
      let participant = new Participant(account, transaction.detail_id, participantBody);
      participantsList.push(participant);
    }

    let transactionBody = new TransactionBody(metaData, participantsList);
    let newTransaction = new Transaction(transactionId, transactionBody);
    transactionsEntities.push(newTransaction);
    return transactionsEntities;
  }
}