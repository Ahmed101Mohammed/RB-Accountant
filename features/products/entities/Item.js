import Joi from "joi";
import { ItemBody } from "./ItemBody.js";

export class Item
{
  #id; // internal_id in db
  #body;

  static idSchema = Joi
    .number()
    .integer();

  constructor(id, body)
  {
    this.id = id
    this.body = body
  }

  set id(id)
  {
    this.#id = id;
  }
  get id()
  {
    return this.#id
  }

  set body(body)
  {
    if(!ItemBody.isItemBody(body)) throw new Error('Item body attribute must be ItemBody object');
    this.#body = body;
  }

  get body()
  {
    return this.#body
  }

  get bodyId()
  {
    return this.body.id;
  }

  get bodyName()
  {
    return this.body.name;
  }

  toJson()
  {
    return {
      internalId: this.id,
      body: this.body.toJson()
    }
  }

  static isItem(object)
  {
    return object instanceof Item
  }

  static createMultibleItemsEntities(itemData)
  {
    let items = [];
    for(let item of itemData)
    {
      let itemBody = new ItemBody(item.id, item.name);
      let newItem = new Item(item.internal_id, itemBody);
      items.push(newItem);
    }
    return items;
  }

  static print(item)
  {
    if(Item.isItem(item))
    {
      console.log({id: item.getId(), body: item.body.print()})
    }
  }
}