import Joi from "joi";
import { isValid } from "../utils/isValid.js";
import {ParticipantBody} from "./ParticipantBody.js";

export class LightParticipant
{
  #body;
  #id;
  static idSchema = Joi
              .string()
              .pattern(/^\d+$/, 'كود الحساب يحتوي على أرقام فقط')
              .min(1)
              .max(20)
              .messages({
              'string.min': 'كود الحسب يتكون على الأقل من رقم واحد',
              'string.max': 'أقصى طول لكود الحساب 20 رقما',
              'any.required': 'يجب أن يكون للحساب كود',
              'string.pattern.base': 'كود الحساب يحتوي على أرقام فقط'
            });
  constructor(id, participantBody)
  {
    this.setId(id);
    this.setParticipantBody(participantBody);
  }

  setId(id)
  {
    id = id.toString().trim()
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

  get id()
  {
    return this.#id;
  }

  get body()
  {
    return this.#body
  }

  toJson()
  {
    return {
      id: this.id,
      body: this.body.toJson(),
    }
  }
  static isLightParticipant(object)
  {
    return object instanceof LightParticipant;
  }

}