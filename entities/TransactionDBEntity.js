class TransactionDBEntity
{
  #amount;
  #debtorId;
  #creditorId;
  #comment;
  #date;
  constructor(amount, debtorId, creditorId, comment, date)
  {
    this.#amount = amount
    this.#debtorId = debtorId
    this.#creditorId = creditorId
    this.#comment = comment
    this.#date = date
  }

  getAmount() {
    return this.#amount;
  }

  getDebtorId() {
    return this.#debtorId;
  }

  getCreditorId() {
    return this.#creditorId;
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
      amount: this.getAmount(),
      debtorId: this.getDebtorId(),
      creditorId: this.getCreditorId(),
      comment: this.getComment(),
      date: this.getDate()
    }
  }

  static isTransactionDBEntity(object)
  {
    return object instanceof TransactionDBEntity
  }

  // static createMultibletransactionsEntities(transactionsData)
  // {
  //   let transactions = [];
  //   for(let transaction of transactionsData)
  //   {
  //     let newtransaction = new transaction(transaction.id, transaction.name)
  //     transactions.push(newtransaction)
  //   }
  //   return transactions
  // }

  static print(transaction)
  {
    if(transaction.istransaction(transaction))
    {
      console.log({
        id: transaction.getId(), 
        amount: transaction.getAmount(),
        debtorId: transaction.getDebtorId(),
        creditorId: transaction.getCreditorId(),
        comment: transaction.getComment(),
        date: transaction.getDate()
      })
    }
  }
}

export default TransactionDBEntity