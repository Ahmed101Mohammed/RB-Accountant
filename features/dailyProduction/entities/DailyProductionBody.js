import Joi from "joi";
import { ShiftList } from "./ShiftList.js";
import { isValid } from "../../../entities/utils/isValid.js";

export class DailyProductionBody
{
  static dateSchema = Joi
    .string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd')
    .messages({
        'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
        'string.empty': 'حقل التاريخ مطلوب',
        'any.required': 'هذا الحقل مطلوب'
      });

  #shiftList = null;
  #date = null;

  constructor(shiftList, date)
  {
    this.shiftList = shiftList;
    this.date = date;
  }

  static isDailyProductionBody(object)
  {
    return object instanceof DailyProductionBody;
  }

  set shiftList(shiftList)
  {
    if(!ShiftList.isShiftList(shiftList)) throw new Error('DailyProductionBody Error: shiftList property expect to be ShiftList object.');
    this.#shiftList = shiftList;
  }
  
  get shiftList()
  {
    return this.#shiftList;
  }

  get shifts()
  {
    return this.shiftList.shifts;
  }

  set date(date)
  {
    const isValidDate = isValid(DailyProductionBody.dateSchema, date);
    if(!isValidDate[0]) throw new Error(isValidDate[1].message);
    this.#date = date;
  }

  get date()
  {
    return this.#date;
  }

  static createDailyProductionBodyEntityForWriting(dailyProductionBodyData)
  {
    const { date } = dailyProductionBodyData;
    const shiftList = ShiftList.createShiftListEntityForWriting(dailyProductionBodyData.shifts);
    return new DailyProductionBody(shiftList, date);
  }

  static createDailyProductionBodyForReading(dailyProduction)
  {
    const date = dailyProduction.date;
    const shiftList = ShiftList.createShiftListForReading(dailyProduction.shifts);
    return new DailyProductionBody(shiftList, date);
  }

  toJson()
  {
    return {
      date: this.date,
      shifts: this.shiftList.toJson()
    }
  }
}