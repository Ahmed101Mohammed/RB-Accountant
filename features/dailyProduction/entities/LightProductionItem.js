import { DetailList } from "./DetailList.js";
import { Item } from "../../items/entities/Item.js";
import Account from "../../../entities/Account.js";
import { isValid } from "../../../entities/utils/isValid.js";

export class LightProductionItem
{
  #itemId = null;
  #accountId = null;
  #detailList = null;

  constructor(itemId, accountId, detailList)
  {
    this.itemId = itemId;
    this.accountId = accountId;
    this.detailList = detailList;
  }

  static isLightProductionItem(object)
  {
    return object instanceof LightProductionItem;
  }

  set detailList(detailList)
  {
    if(!DetailList.isDetailList(detailList)) throw new Error("LightProductionItem Error: detailList property expect to be DetailList object.");
    this.#detailList = detailList;
  }

  get detailList()
  {
    return this.#detailList;
  }
  
  set itemId(id)
  {
    const isValitemId = isValid(Item.idSchema, id);
    if(!isValitemId[0]) throw new Error(isValitemId[1].message);
    this.#itemId = id;
  }

  get itemId()
  {
    return this.#itemId;
  }

  set accountId(id)
  {
    const isValidId = isValid(Account.idSchema, id);
    if(!isValidId[0]) throw new Error(isValidId[1].message);
    this.#accountId = id;
  }

  get accountId()
  {
    return this.#accountId;
  }

  // extra getters
  get details()
  {
    return this.detailList.details;
  }

  static createLightProdcutionItemForWriting(lightProductionItem)
  {
    const itemId = lightProductionItem.itemId;
    const accountId = lightProductionItem.accountId;
    const detailList = DetailList.createDetailListForWriting(lightProductionItem.details);
    return new LightProductionItem(itemId, accountId, detailList);
  }

  toJson()
  {
    return {
      itemId: this.itemId,
      accountId: this.accountId,
      details: this.detailList.toJson()
    }

  }
}