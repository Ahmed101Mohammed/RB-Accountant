import {Account} from "../../accounts/entities/Account.js";
import { ItemBody } from "../../products/entities/ItemBody.js";
import { DetailList } from "./DetailList.js";

export class ProductionItem
{
  #itemBody = null;
  #account = null;
  #detailList = null;

  constructor(itemBody, account, detailList)
  {
    this.itemBody = itemBody;
    this.account = account;
    this.detailList = detailList;
  }

  static isProductionItem(object)
  {
    return object instanceof ProductionItem;
  }

  set detailList(detailList)
  {
    if(!DetailList.isDetailList(detailList)) throw new Error("ProductionItem Error: detailList property expect to be DetailList object.");
    this.#detailList = detailList;
  }

  get detailList()
  {
    return this.#detailList;
  }
  
  set itemBody(itemBody)
  {
    if(!ItemBody.isItemBody(itemBody)) throw new Error("ProductionItem Error: itemBody property expect to be ItemBody object.");
    this.#itemBody = itemBody;
  }

  get itemBody()
  {
    return this.#itemBody;
  }

  set account(account)
  {
    if(!Account.isAccount(account)) throw new Error("ProductionItem Error: account property expect to be Account object.");
    this.#account = account;
  }

  get account()
  {
    return this.#account;
  }

  static createProductionItemForReading(productionItem)
  {
    const itemBody = new ItemBody(productionItem.itemId, productionItem.itemName);
    const accountData = productionItem.accounts[0];
    const account = new Account(accountData.accountId, accountData.accountName);
    const detailList = DetailList.createDetailListForReading(productionItem.assignments);
    return new ProductionItem(itemBody, account, detailList);
  }

  toJson()
  {
    return {
      item: this.itemBody.toJson(),
      account: this.account.toJson(),
      details: this.detailList.toJson(),
    }
  }
}