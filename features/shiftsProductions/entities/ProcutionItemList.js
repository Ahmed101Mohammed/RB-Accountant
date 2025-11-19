import { ProductionItem } from "./ProductionItem.js";
import { LightProductionItem } from "./LightProductionItem.js";

export class ProductionItemList
{
  #productionItems = [];
  #listType = null;

  static isProductionItemList(object)
  {
    return object instanceof ProductionItemList
  }
  
  push(producitonItem)
  {
    if(this.#productionItems.length === 0)
    {
      if(ProductionItem.isProductionItem(producitonItem))
      {
        this.#productionItems.push(producitonItem);
        this.#listType = ProductionItem;
      }
      else if(LightProductionItem.isLightProductionItem(producitonItem))
      {
        this.#productionItems.push(producitonItem);
        this.#listType = LightProductionItem;
      }
      else throw new Error(`ProductionItemList just accept objects instance of ProductionItem or LightProductionItem class`)
    }
    else
    {
      if(producitonItem instanceof this.#listType)
      {
        this.#productionItems.push(producitonItem)
      } 
      else throw new Error(`This ProductionItemList jsut accept objects instance of ${this.#listType.name}`)
    }
  }

  toJson()
  {
    return this.productionItems.map(producitonItem => producitonItem.toJson());
  }

  get productionItems()
  {
    return this.#productionItems;
  }

  static createProductionItemListForWriting(lightProductionItems)
  {
    let productionItemList = new ProductionItemList();
    for(let lightProductionItem of lightProductionItems)
    {
      const lightProductionItemObject = LightProductionItem.createLightProdcutionItemForWriting(lightProductionItem);
      productionItemList.push(lightProductionItemObject);
    }
    return productionItemList;
  }

  static createProductionItemListForReading(productionItems)
  {
    let productionItemList = new ProductionItemList();
    for(let productionItem of productionItems)
    {
      const productionItemObject = ProductionItem.createProductionItemForReading(productionItem);
      productionItemList.push(productionItemObject);
    }
    return productionItemList;
  }

  toJson()
  {
    return this.productionItems.map(productionItem => productionItem.toJson())
  }
}