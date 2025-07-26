import { Shift } from "./Shift.js";
import { ShiftBody } from "./ShiftBody.js";

export class ShiftList
{
  #shifts = [];
  #listType = null;

  static isShiftList(object)
  {
    return object instanceof ShiftList
  }

  push(shift)
  {
    if(this.#shifts.length === 0)
    {
      if(Shift.isShift(shift))
      {
        this.#shifts.push(shift);
        this.#listType = Shift;
      }
      else if(ShiftBody.isShiftBody(shift))
      {
        this.#shifts.push(shift);
        this.#listType = ShiftBody;
      }
      else throw new Error(`ShiftList just accept objects instance of Shift or ShiftBody class`)
    }
    else
    {
      if(shift instanceof this.#listType)
      {
        this.#shifts.push(shift)
      } 
      else throw new Error(`This ShiftList jsut accept objects instance of ${this.#listType.name}`)
    }
  }

  toJson()
  {
    return this.shifts.map(shift => shift.toJson());
  }

  get shifts()
  {
    return this.#shifts;
  }

  static createShiftListEntityForWriting(shiftsBodies)
  {
    const shiftList = new ShiftList();
    for(let shiftBody of shiftsBodies)
    {
      const shiftBodyObject = ShiftBody.createShiftBodyForWriting(shiftBody);
      shiftList.push(shiftBodyObject);
    }
    return shiftList;
  }

  static createShiftListForReading(shifts)
  {
    const shiftList = new ShiftList();
    for(let shift of shifts)
    {
      const shiftObject = Shift.createShiftForReading(shift);
      shiftList.push(shiftObject);
    }
    return shiftList;
  }

  toJson()
  {
    return this.shifts.map(shift=> shift.toJson());
  }
}