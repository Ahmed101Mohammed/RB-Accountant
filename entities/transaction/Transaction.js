import isValid from "../utils/isValid.js";
import TransactionBody from "./TransactionBody";

class Transaction
{
  #id;
  #body;
  static idSchema = Joi.string().min(1).pattern(/^\d+$/);
  constructor(id, transactionBody)
  {
    this.setId(id);
    this.setTransactionBody(transactionBody);
  }

  setId(id)
  {
    id = id.trim()
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
}

export default Transaction