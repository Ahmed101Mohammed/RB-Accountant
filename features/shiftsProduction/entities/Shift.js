import Joi from "joi";
import { ShiftBody } from "./ShiftBody.js";
import { isValid } from "../../../entities/utils/isValid.js";

export class Shift
{
  static idSchema = Joi
    .number()
    .integer()
    .min(0);

  #shiftBody = null;
  #id = null;

  constructor(shiftBody, id)
  {
    this.shiftBody = shiftBody;
    this.id = id;
  }

  static isShift(object)
  {
    return object instanceof Shift;
  }

  set shiftBody(shiftBody)
  {
    if(!ShiftBody.isShiftBody(shiftBody)) throw new Error('Shift Error: shiftBody property expect to be ShiftBody object.');
    this.#shiftBody = shiftBody;
  }
  
  get shiftBody()
  {
    return this.#shiftBody;
  }

  set id(id)
  {
    const isValidId = isValid(Shift.idSchema, id);
    if(!isValidId[0]) throw new Error(isValidId[1].message);
    this.#id = id;
  }
  
  get id()
  {
    return this.#id;
  }

  static createShiftForReading(shift)
  {
    const id = shift.shiftId;
    const body = ShiftBody.createShiftBodyForReading(shift);
    return new Shift(body, id);
  }

  toJson()
  {
    return {
      id: this.id,
      body: this.shiftBody.toJson()
    }
  }
}