import ParticipantsList from "./ParticipantsList.js";
import TransactionMetaData from "./TransactionMetaData.js"

class TransactionBody
{
  #metaData
  #participants
  constructor(metaData, participants)
  {

  }

  setMetaData(metaData)
  {
    if(!TransactionMetaData.isTransactionMetaData(metaData)) throw new Error(`TrnasactionBody expect TransactionMetaData object as a value for metaData member.`)
    this.#metaData = metaData;
  }

  setParticipants(participants)
  {
    if(!ParticipantsList.isParticipantList(participants)) throw new Error(`TrnasactionBody expect ParticipantList object as a value for participants memeber.`)
    this.#participants = participants
  }

  static isTransactionBody(object)
  {
    return object instanceof TransactionBody
  }

  getMetaData()
  {
    return this.#metaData
  }

  getParticipants()
  {
    return this.#participants
  }
}

export default TransactionBody