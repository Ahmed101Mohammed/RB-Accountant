import Joi from "joi";
import { DailyProductionBody } from "./DailyProductionBody.js";
import { isValid } from "../../../entities/utils/isValid.js";

export class DailyProduction
{
  static idSchema = Joi
    .number()
    .integer()
    .min(0);

  #dailyProductionBody = null;
  #id = null;

  constructor(dailyProductionBody, id)
  {
    this.dailyProductionBody = dailyProductionBody;
    this.id = id;
  }

  static isDailyProduction(object)
  {
    return object instanceof DailyProduction;
  }

  set dailyProductionBody(dailyProductionBody)
  {
    if(!DailyProductionBody.isDailyProductionBody(dailyProductionBody)) throw new Error('DailyProduction Error: dailyProductionBody property expect to be DailyProductionBody object.');
    this.#dailyProductionBody = dailyProductionBody;
  }
  
  get dailyProductionBody()
  {
    return this.#dailyProductionBody;
  }

  set id(id)
  {
    const isValidId = isValid(DailyProduction.idSchema, id);
    if(!isValidId[0]) throw new Error(isValidId[1].message);
    this.#id = id;
  }
  
  get id()
  {
    return this.#id;
  }

  static createDailyProductionForReading(dailyProduction)
  {
    let dailyProductionBody = DailyProductionBody.createDailyProductionBodyForReading(dailyProduction);
    let id = dailyProduction.id;
    return new DailyProduction(dailyProductionBody, id);
  }

  static createMultipleDailyProductions(dailyProductions)
  {
    const dailyProductionList = [];
    for(let dailyProduction of dailyProductions)
    {
      dailyProductionList.push(DailyProduction.createDailyProductionForReading(dailyProduction));
    }
    return dailyProductionList;
  }

  toJson()
  {
    return {
      id: this.id,
      body: this.dailyProductionBody.toJson()
    }
  }
}