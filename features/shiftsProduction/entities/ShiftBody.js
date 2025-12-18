import Joi from "joi";
import { DayDuration } from "./DayDuration.js";
import { ProductionItemList } from "./ProcutionItemList.js";
import { isValid } from "../../../entities/utils/isValid.js";

export class ShiftBody
{
  static nameSchema = Joi
    .string()
    .valid('morning', 'night', 'overtime');

  #name = null;
  #dayDuration = null;
  #productionItemList = null;

  constructor(name, productionItemList, dayDuration)
  {
    this.name = name;
    this.productionItemList = productionItemList;
    this.dayDuration = dayDuration;
  }

  static isShiftBody(object)
  {
    return object instanceof ShiftBody;
  }

  set name(name)
  {
    const isValidName = isValid(ShiftBody.nameSchema, name);
    if(!isValidName[0]) throw new Error(isValidName[1].message);
    this.#name = name;
  }

  get name()
  {
    return this.#name;
  }

  set dayDuration(dayDuration)
  {
    if(!DayDuration.isDayDuration(dayDuration)) throw new Error('ShiftBody Error: dayDuration property expect to be DayDuration object.');
    this.#dayDuration = dayDuration;
  }
  
  get dayDuration()
  {
    return this.#dayDuration;
  }

  set productionItemList(productionItemList)
  {
    if(!ProductionItemList.isProductionItemList(productionItemList)) throw new Error('ShiftBody Error: productionItemList property expect to be ProductionItemList object.');
    this.#productionItemList = productionItemList;
  }
  
  get productionItemList()
  {
    return this.#productionItemList;
  }

  // external getters
  get startAt()
  {
    return this.dayDuration.startAt;
  }

  get endAt()
  {
    return this.dayDuration.endAt;
  }

  get productionItems()
  {
    return this.productionItemList.productionItems;
  }

  static createShiftBodyForWriting(shiftBody)
  {
    const name = shiftBody.name;
    const dayDuration = new DayDuration(shiftBody.startAt, shiftBody.endAt);
    const productionItemList = ProductionItemList.createProductionItemListForWriting(shiftBody.items);
    return new ShiftBody(name, productionItemList, dayDuration);
  }

  static createShiftBodyForReading(shift)
  {
    const name = shift.shiftName;
    const dayDuration = new DayDuration(shift.shiftStartAt, shift.shiftEndAt);
    const productionItemList = ProductionItemList.createProductionItemListForReading(shift.items);
    return new ShiftBody(name, productionItemList, dayDuration);
  }

  toJson()
  {
    return {
      name: this.name,
      dayDuration: this.dayDuration.toJson(),
      productionItems: this.productionItemList.toJson(),
    }
  }
}