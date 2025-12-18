import Joi from "joi";
import { isValid } from "../../../entities/utils/isValid.js";
import { DayDuration } from "./DayDuration.js";

export class DetailBody
{
  static quantitySchema = Joi
    .number()
    .integer()
    .min(0);

  #dayDuration = null;
  #highQualityQuantity = 0;
  #lowQualityQuantity = 0;

  constructor(dayDuration, highQualityQuantity, lowQualityQuantity)
  {
    this.dayDuration = dayDuration;
    this.highQualityQuantity = highQualityQuantity;
    this.lowQualityQuantity = lowQualityQuantity;
  }

  static isDetailBody(object)
  {
    return object instanceof DetailBody;
  }

  set dayDuration(dayDuration)
  {
    if(!DayDuration.isDayDuration(dayDuration)) throw new Error('DetailBody Error: dayDuration property expect to be DayDuration object.');
    this.#dayDuration = dayDuration;
  }
  
  get dayDuration()
  {
    return this.#dayDuration;
  }

  set highQualityQuantity(quantity)
  {
    const isValidQuantity = isValid(DetailBody.quantitySchema, quantity);
    if(!isValidQuantity[0]) throw new Error(isValidQuantity[1].message);
    this.#highQualityQuantity = quantity;
  }

  get highQualityQuantity()
  {
    return this.#highQualityQuantity;
  }

  set lowQualityQuantity(quantity)
  {
    const isValidQuantity = isValid(DetailBody.quantitySchema, quantity);
    if(!isValidQuantity[0]) throw new Error(isValidQuantity[1].message);
    this.#lowQualityQuantity = quantity;
  }

  get lowQualityQuantity()
  {
    return this.#lowQualityQuantity;
  }

  // Extra getters
  get startAt()
  {
    return this.dayDuration.startAt;
  }

  get endAt()
  {
    return this.dayDuration.endAt;
  }

  static createDetailBodyForReading(detail)
  {
    const highQualityQuantity = detail.highQualityQuantity;
    const lowQualityQuantity = detail.lowQualityQuantity;
    const dayDuration = new DayDuration(detail.detailStartAt, detail.detailEndAt);
    return new DetailBody(dayDuration, highQualityQuantity, lowQualityQuantity);
  }

  toJson()
  {
    return {
      dayDuration: this.dayDuration.toJson(),
      highQualityQuantity: this.highQualityQuantity,
      lowQualityQuantity: this.lowQualityQuantity
    }
  }
}