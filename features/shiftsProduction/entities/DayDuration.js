import Joi from "joi";
import { isValid } from "../../../entities/utils/isValid.js";

export class DayDuration
{
  static hourSchema = Joi
    .number()
    .integer()
    .min(0)
    .max(23);

  #startAt = null;
  #endAt = null;

  constructor(startHour, endHour)
  {
    this.startAt = startHour;
    this.endAt = endHour;
  }

  static isDayDuration(object)
  {
    return object instanceof DayDuration;
  }

  set startAt(hour)
  {
    const isValidHour = isValid(DayDuration.hourSchema, hour);
    if(!isValidHour[0]) throw new Error(isValidHour[1].message);
    this.#startAt = hour;
  }
  
  get startAt()
  {
    return this.#startAt;
  }

  set endAt(hour)
  {
    const isValidHour = isValid(DayDuration.hourSchema, hour);
    if(!isValidHour[0]) throw new Error(isValidHour[1].message);
    this.#endAt = hour;
  }

  get endAt()
  {
    return this.#endAt;
  }

  toJson()
  {
    return {
      startAt: this.startAt,
      endAt: this.endAt
    }
  }
}