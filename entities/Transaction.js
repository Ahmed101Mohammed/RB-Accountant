// import Account from "./Account.js";
// import TransactionDBEntity from "./TransactionBody.js";
// import TransactionParticipant from "./TransactionParticipant.js";

// class Transaction
// {
//   #id;
//   #date
//   #comment
//   #participants;

//   constructor(id, date, comment, participants)// {id, date, comment, participants: [TransactionParticipant,...]}
//   {
//     this.#id = id
//     this.#date = date
//     this.#comment = comment
//     for(let participant of participants)
//     {
//       if(!TransactionParticipant.isTransactionParticipant(participant)) throw new Error('Expect transaction particpants to be a TransactionParticipant instance')
//     }
//     this.#participants = participants
//   }

//   toJson()
//   {
//     console.log("Error maybe here", this.getPaticipants())
//     return {
//       id: this.getId(),
//       date: this.getDate(),
//       comment: this.getComment(),
//       participants: this.getPaticipants().map(particpant => particpant.toJson())
//     }
//   }

//   static isTransaction(object)
//   {
//     return object instanceof Transaction
//   }

//   static createMultibleTransactionsEntities(transactionsData)
//   {
//     // [{id, date, comment, amount, account_id, account_name, state, detail_id},...]
//     let transactions = [];
//     let transaction_ = null;
//     let curr_id = null;
//     for(let transaction of transactionsData)
//     {
//       const {id, date, comment, amount, account_id, account_name, state, detail_id} = transaction;
//       if(curr_id && curr_id !== id)
//       {
//         let newTransaction = new Transaction(transaction_.id, transaction_.date, transaction_.comment, transaction_.participants)
//         transactions.push(newTransaction)
//         curr_id = null;
//         transaction_ = null;
//       }
//       if(!curr_id) curr_id = id
//       if(!transaction_) transaction_ = {id: id, date: date, comment: comment, participants: []}

//       const account = new Account(account_id, account_name)
//       const participant = new TransactionParticipant(account, amount, state, detail_id)
//       transaction_.participants.push(participant)
//     }
//     return transactions
//   }

//   getId()
//   {
//     return this.#id
//   }

//   getPaticipants()
//   {
//     return this.#participants
//   }

//   getDate()
//   {
//     return this.#date
//   }

//   getComment()
//   {
//     return this.#comment
//   }

//   print()
//   {
//     console.log({
//       id: this.getId(),
//       comment: this.getComment(),
//       date: this.getDate(),
//       participants: this.getPaticipants().map(participant => participant.toJson())
//     })
//   }
// }

// export default Transaction