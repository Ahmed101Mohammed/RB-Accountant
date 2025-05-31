import Joi from "joi";
import isValid from "../utils/isValid.js";
import ParticipantBody from "./ParticipantBody.js";

class LightParticipant
{
  #body;
  #id;
  static idSchema = Joi
              .string()
              .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
              .min(1)
              .max(20);
  constructor(id, participantBody)
  {
    this.setId(id);
    this.setParticipantBody(participantBody);
  }

  setId(id)
  {
    id = id.trim()
    const schema = LightParticipant.idSchema.required();
    const isValidId = isValid(schema, id)
    if(!isValidId[0]) throw new Error(isValidId[1].message)
    this.#id = isValidId[1];
  }

  setParticipantBody(participantBody)
  {
    if(!ParticipantBody.isParticipantBody(participantBody)) throw new Error(`LightParticipant body member, should be an object of Participant body entity.`)
    this.#body = participantBody;
  }

  getId()
  {
    return this.#id;
  }

  getBody()
  {
    return this.#body
  }

  isLightParticipant(object)
  {
    return object instanceof LightParticipant;
  }

}

export default LightParticipant