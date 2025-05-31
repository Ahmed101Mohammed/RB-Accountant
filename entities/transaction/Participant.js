import Joi from "joi";
import isValid from "../utils/isValid.js";
import Account from "../Account.js";
import ParticipantBody from "./ParticipantBody.js";

class Participant
{
  #body;
  #account;
  #dbRecordId;
  static dbRecordIdShcema = Joi.string().min(1).pattern(/^\d+$/);
  constructor(account, dbRecordId, participantBody)
  {
    this.setAccount(account);
    this.setDBRecordId(dbRecordId);
    this.setParticipantBody(participantBody);
  }

  setDBRecordId(dbRecordId)
  {
    dbRecordId = dbRecordId.trim()
    const schema = Participant.dbRecordIdShcema.required();
    const isValidDBRecordId = isValid(schema, dbRecordId)
    if(!isValidDBRecordId[0]) throw new Error(isValidDBRecordId[1].message)
    this.#dbRecordId = isValidDBRecordId[1];
  }

  setAccount(account)
  {
    if(!Account.isAccount(account)) throw new Error(`Participant account member, should be an object of Account entity.`)
    this.#account = account;
  }
  setParticipantBody(participantBody)
  {
    if(!ParticipantBody.isParticipantBody(participantBody)) throw new Error(`Participant body member, should be an object of Participant body entity.`)
    this.#body = participantBody;
  }

  getDBRecordId()
  {
    return this.#dbRecordId;
  }

  getAccount()
  {
    return this.#account;
  }

  getBody()
  {
    return this.#body
  }

  isParticipant(object)
  {
    return object instanceof Participant;
  }

}

export default Participant