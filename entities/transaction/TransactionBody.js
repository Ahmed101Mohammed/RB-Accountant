import {ParticipantsList} from "./ParticipantsList.js";
import {TransactionMetaData} from "./TransactionMetaData.js"

export class TransactionBody
{
  #metaData
  #participantsList
  constructor(metaData, participantsList)
  {
    this.metaData = metaData;
    this.participantsList = participantsList;
  }

  set metaData(metaData)
  {
    if(!TransactionMetaData.isTransactionMetaData(metaData)) throw new Error(`TrnasactionBody expect TransactionMetaData object as a value for metaData member.`)
    this.#metaData = metaData;
  }

  set participantsList(participantsList)
  {
    if(!ParticipantsList.isParticipantList(participantsList)) throw new Error(`TrnasactionBody expect ParticipantList object as a value for participantsList memeber.`)
    this.#participantsList = participantsList
  }

  static isTransactionBody(object)
  {
    return object instanceof TransactionBody
  }

  getMetaData()
  {
    return this.#metaData
  }

  get participantsList()
  {
    return this.#participantsList
  }

  get participants()
  {
    return this.participantsList.participants;
  }

  toJson()
  {
    return {
      metaData: this.getMetaData().toJson(),
      participants: this.#participantsList.toJson(),
    }
  }
}
