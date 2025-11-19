import { DetailBody } from "./DetailBody.js";
import { DetailHead } from "./DetailHead.js";

export class Detail
{
  #detailBody = null;
  #detailHead = null;

  constructor(detailBody, detailHead)
  {
    this.detailBody = detailBody;
    this.detailHead = detailHead;
  }

  static isDetail(object)
  {
    return object instanceof Detail;
  }

  set detailBody(detailBody)
  {
    if(!DetailBody.isDetailBody(detailBody)) throw new Error('Detail Error: detailBody property expect to be DetailBody object.');
    this.#detailBody = detailBody;
  }
  
  get detailBody()
  {
    return this.#detailBody;
  }

  set detailHead(detailHead)
  {
    if(!DetailHead.isDetailHead(detailHead)) throw new Error('Detail Error: detailHead property expect to be DetailHead object.');
    this.#detailHead = detailHead;
  }
  
  get detailHead()
  {
    return this.#detailHead;
  }

  static createDetailForReading(detail)
  {
    const detailBody = DetailBody.createDetailBodyForReading(detail);
    const detailHead = DetailHead.createDetailHeadForReading(detail);
    return new Detail(detailBody, detailHead);
  }

  toJson()
  {
    return {
      head: this.detailHead.toJson(),
      body: this.detailBody.toJson()
    }
  }
}