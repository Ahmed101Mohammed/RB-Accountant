// // All entities related to Transatction need to restructured.
// class TransactionParticipant
// {
//   #account
//   #amount
//   #state
//   #dbRecordId
//   constructor(account, amount, state, dbRecordId)
//   {
//     this.#account = account
//     this.#amount = amount
//     this.#state = state
//     this.#dbRecordId = dbRecordId
//   }

//   static isTransactionParticipant(transactionParticipantObject)
//   {
//     return transactionParticipantObject instanceof TransactionParticipant
//   }

//   toJson()
//   {
//     return {
//       dbRecordId: this.getDBRecordId(),
//       account: this.getAccount().toJson(),
//       amount: this.getAmount(),
//       state: this.getState()
//     }
//   }
  
//   getAccount()
//   {
//     return this.#account
//   }

//   getAmount()
//   {
//     return this.#amount
//   }

//   getState()
//   {
//     return this.#state
//   }

//   getDBRecordId()
//   {
//     return this.#dbRecordId
//   }

// }

// export default TransactionParticipant