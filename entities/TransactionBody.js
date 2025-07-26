// import TransactionParticipant from "./TransactionParticipant";

// class TransactionDBEntity
// {
//   #participants
//   #comment;
//   #date;
//   constructor(date, comment, participants)
//   {
//     this.#comment = comment
//     this.#date = date
//     this.setParticipants(participants)
//   }

//   getParticipants()
//   {
//     return this.#participants;
//   }

//   getComment() {
//     return this.#comment;
//   }

//   getDate() {
//     return this.#date;
//   }

//   toJson()
//   {
//     return {
//       amount: this.getAmount(),
//       debtorId: this.getDebtorId(),
//       creditorId: this.getCreditorId(),
//       comment: this.getComment(),
//       date: this.getDate()
//     }
//   }

//   setParticipants(participants)
//   {
//     this.#participants = participants.map(participant => new TransactionParticipant());
//   }

//   static isTransactionDBEntity(object)
//   {
//     return object instanceof TransactionDBEntity
//   }

// }

// export default TransactionDBEntity
