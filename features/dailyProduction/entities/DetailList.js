import { Detail } from "./Detail.js";
import { LightDetail } from "./LightDetail.js";

export class DetailList
{
  #details = [];
  #listType = null;

  static isDetailList(object)
  {
    return object instanceof DetailList
  }

  push(detail)
  {
    if(this.#details.length === 0)
    {
      if(Detail.isDetail(detail))
      {
        this.#details.push(detail);
        this.#listType = Detail;
      }
      else if(LightDetail.isLightDetail(detail))
      {
        this.#details.push(detail);
        this.#listType = LightDetail;
      }
      else throw new Error(`DetailList just accept objects instance of Detail or LightDetail class`)
    }
    else
    {
      if(detail instanceof this.#listType)
      {
        this.#details.push(detail)
      } 
      else throw new Error(`This DetailList jsut accept objects instance of ${this.#listType.name}`)
    }
  }

  toJson()
  {
    return this.details.map(detail => detail.toJson());
  }

  get details()
  {
    return this.#details;
  }

  static createDetailListForWriting(lightDetails)
  {
    let detailList = new DetailList();
    for(let lightDetail of lightDetails)
    {
      const lightDetailObject = LightDetail.createLightDetailForWriting(lightDetail);
      detailList.push(lightDetailObject);
    }
    return detailList;
  }

  static createDetailListForReading(details)
  {
    let detailList = new DetailList();
    for(let detail of details)
    {
      const detailObject = Detail.createDetailForReading(detail);
      detailList.push(detailObject);
    }
    return detailList;
  }

  toJson()
  {
    return this.details.map(detail => detail.toJson());
  }
}