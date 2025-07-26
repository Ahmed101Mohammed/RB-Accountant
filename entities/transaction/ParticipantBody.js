import Joi from "joi";
import { isValid } from "../utils/isValid.js";

export class ParticipantBody 
{
  #role
  #amount
  static roleSchema = Joi
    .number()
    .integer()
    .min(0)
    .max(1);
  static amountSchema = Joi
    .number()
    .min(0.01)
    .messages({
              'number.base': 'مبلغ لبمعاملة يجب أن يكون رقما',
              'number.precision': 'لا يسمح بأجزاء من ألف لمبلغ المعاملة',
              'number.min': 'أقل مبلغ للمعاملة قرش واحد'
            });
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
    this.#amount = isValidAmount[1]
  }

  get role()
  {
    return this.#role;
  }

  get amount()
  {
    return this.#amount;
  }

  toJson()
  {
    return {
      amount: this.amount,
      role: this.role,
    }
  }
  static isParticipantBody(object)
  {
    return object instanceof ParticipantBody
  }
}