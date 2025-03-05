import Account from "./Account.js";

class Transaction
{
  #id;
  #amount;
  #debtorAccount;
  #creditorAccount;
  #comment;
  #date;
  constructor(id, amount, debtorAccount, creditorAccount, comment, date)
  {
    this.#id = id
    this.#amount = amount
    this.#debtorAccount = debtorAccount
    this.#creditorAccount = creditorAccount
    this.#comment = comment
    this.#date = date
  }

  getId()
  {
    return this.#id
  }

  getAmount() {
    return this.#amount;
  }

  getDebtorAccount() {
    return this.#debtorAccount;
  }

  getCreditorAccount() {
    return this.#creditorAccount;
  }

  getComment() {
    return this.#comment;
  }

  getDate() {
    return this.#date;
  }

  toJson()
  {
    return {
      id: this.getId(),
      amount: this.getAmount(),
      debtorAccount: this.getDebtorAccount().toJson(),
      creditorAccount: this.getCreditorAccount().toJson(),
      comment: this.getComment(),
      date: this.getDate()
    }
  }

  static isTransaction(object)
  {
    return object instanceof Transaction
  }

  static createMultibleTransactionsEntities(transactionsData)
  {
    let transactions = [];
    for(let transaction of transactionsData)
    {
      const debtor = new Account(transaction.debtor_id, transaction.debtor_name)
      const creditor = new Account(transaction.creditor_id, transaction.creditor_name)
      let newtransaction = new Transaction(transaction.id, transaction.amount, debtor, creditor, transaction.comment, transaction.date)
      transactions.push(newtransaction)
    }
    return transactions
  }

  static print(transaction)
  {
    if(transaction.istransaction(transaction))
    {
      console.log({
        id: transaction.getId(), 
        amount: transaction.getAmount(),
        debtorAccount: transaction.getDebtorAccount().print(),
        creditorAccount: transaction.getCreditorAccount().print(),
        comment: transaction.getComment(),
        date: transaction.getDate()
      })
    }
  }
}

export default Transaction