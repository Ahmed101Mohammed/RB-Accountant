import { DayDuration } from "./DayDuration.js";
import { DetailBody } from "./DetailBody.js";
import { LightDetailHead } from "./LightDetailHead.js";

export class LightDetail
{
  #detailBody = null;
  #lightDetailHead = null;

  constructor(detailBody, lightDetailHead)
  {
    this.detailBody = detailBody;
    this.lightDetailHead = lightDetailHead;
  }

  static isLightDetail(object)
  {
    return object instanceof LightDetail;
  }

  set detailBody(detailBody)
  {
    if(!DetailBody.isDetailBody(detailBody)) throw new Error('LightDetail Error: detailBody property expect to be DetailBody object.');
    this.#detailBody = detailBody;
  }
  
  get detailBody()
  {
    return this.#detailBody;
  }

  set lightDetailHead(lightDetailHead)
  {
    if(!LightDetailHead.isLightDetailHead(lightDetailHead)) throw new Error('LightDetail Error: lightDetailHead property expect to be LightDetailHead object.');
    this.#lightDetailHead = lightDetailHead;
  }
  
  get lightDetailHead()
  {
    return this.#lightDetailHead;
  }

  // Extra getters
  get machineId()
  {
    return this.lightDetailHead.machineId;
  }

  get employeeId()
  {
    return this.lightDetailHead.employeeId;
  }

  get startAt()
  {
    return this.detailBody.startAt;
  }

  get endAt()
  {
    return this.detailBody.endAt;
  }

  get highQualityQuantity()
  {
    return this.detailBody.highQualityQuantity;
  }

  get lowQualityQuantity()
  {
    return this.detailBody.lowQualityQuantity;
  }

  static createLightDetailForWriting(lightDetail)
  {
    const dayDuration = new DayDuration(lightDetail.startAt, lightDetail.endAt);
    const detailBody = new DetailBody(dayDuration, lightDetail.highQualityQuantity, lightDetail.lowQualityQuantity);
    const lightDetailHead = new LightDetailHead(lightDetail.machineId, lightDetail.employeeId);
    return new LightDetail(detailBody, lightDetailHead);
  }

  toJson()
  {
    return {
      head: this.lightDetailHead.toJson(),
      body: this.detailBody.toJson()
    }
  }
}