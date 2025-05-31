import Joi from "joi";
import isValid from "../utils/isValid.js";
class ParticipantBody 
{
  #role
  #amount
  static roleSchema = Joi.number().integer().min(0).max(1);
  static amountSchema = Joi.number().min(0.01);
  constructor(role, amount)
  {
    this.setRole(role);
    this.setAmount(amount);
  }

  setRole(role)
  {
    const schema = ParticipantBody.roleSchema.required();
    const isValidRole = isValid(schema, role);
    if(!isValidRole[0]) throw new Error(isValidRole[1].message)
    this.#role = isValidRole[1];
  }

  setAmount(amount)
  {
    const schema = ParticipantBody.amountSchema.required();
    const isValidAmount = isValid(schema, amount)
    if(!isValidAmount[0]) throw new Error(isValidAmount[1].message)
    this.#amount = isValidRole[1]
  }

  getRole()
  {
    return this.#role;
  }

  getAmount()
  {
    return this.#amount;
  }

  static isParticipantBody(object)
  {
    return object instanceof ParticipantBody
  }
}

export default ParticipantBody