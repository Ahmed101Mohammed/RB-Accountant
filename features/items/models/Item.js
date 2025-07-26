import BaseDB from "../../../models/BaseDB.js";
import { ItemBody } from "../entities/ItemBody.js";
import { Item as ItemEntity } from "../entities/Item.js"
import ErrorHandler from "../../../utils/ErrorHandler.js";

export class Item
{	
  static isSetUped = false
  static setUp()
  {
    BaseDB.updateDB()
    const db = BaseDB.getDB()
    const create = db.prepare(`CREATE TABLE IF NOT EXISTS items(
                  id TEXT UNIQUE NOT NULL,
                  internal_id INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT UNIQUE NOT NULL
                ) STRICT`
              )
    create.run()
    Item.isSetUped = true;
  }

  static create(item)
  {
    if(!Item.isSetUped) Item.setUp()
    if(!ItemBody.isItemBody(item)) throw new Error('(model): Item.create method: expect ItemBody object');
    const itemId = item.id;
    const itemName = item.name;
    const db = BaseDB.getDB();
    const insert = db.prepare('INSERT INTO items (id, name) VALUES (@id, @name)');
    try
    {
      const response = insert.run({
        id: itemId,
        name: itemName
      })

      return response
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      throw error
    }
  }

  static getAllItems()
  {
    if(!Item.isSetUped) Item.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM items')
    const items = query.all();
    const itemsEntities = ItemEntity.createMultibleItemsEntities(items)
    return itemsEntities
  }

  static getItemByName(name)
  {
    if(!Item.isSetUped) Item.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM items WHERE name = @name')
    let item = query.get({name})
    if(item) return new ItemEntity(item.id, item.name)
    return false
  }

  static getItemById(id)
  {
    if(!Item.isSetUped) Item.setUp()
    const db = BaseDB.getDB()
    const query = db.prepare('SELECT * FROM items WHERE internal_id = @id')
    let item = query.get({id});
    let itemBody = new ItemBody(item.id, item.name);
    let itemEntity = new ItemEntity(item.internal_id, itemBody);
    if(item) return itemEntity;
    return false
  }

  static getItemsItsNameContain(partialName) {
    if(!Item.isSetUped) Item.setUp();
    const db = BaseDB.getDB();
    
    const query = db.prepare('SELECT * FROM items WHERE name LIKE @name');
    const items = query.all({ name: `%${partialName}%` });
    const itemsEntities = ItemEntity.createMultibleItemsEntities(items)
    return itemsEntities;
  }

  static getItemsItsIdContain(partialId) {
    if(!Item.isSetUped) Item.setUp();
    const db = BaseDB.getDB();
    
    const query = db.prepare('SELECT * FROM items WHERE id LIKE @id');
    const items = query.all({ id: `%${partialId}%` });
    const itemsEntities = ItemEntity.createMultibleItemsEntities(items)
    return itemsEntities;
  }

  static delete(internalId)
  {
    if(!Item.isSetUped) Item.setUp();
    const db = BaseDB.getDB();
    
    const deleteItem = db.prepare('DELETE FROM items WHERE internal_id = @internalId');
    return deleteItem.run({internalId});
  }

  static update(item)
  {
    if(!Item.isSetUped) Item.setUp();
    if(!ItemEntity.isItem(item)) throw new Error('(model) Item.update method: expect Item object');
    const itemInternalId = item.id;
    const itemId = item.bodyId;
    const itemName = item.bodyName;
    const db = BaseDB.getDB();
    const query = db.prepare('UPDATE items SET name=@newName, id=@newId WHERE internal_id = @internalId');
    try
    {
      const response = query.run({
        internalId: itemInternalId,
        newId: itemId,
        newName: itemName
      });
      return response;
    }
    catch(error)
    {
      ErrorHandler.logError(error)
      return error
    }
  }

  static getInternalIdsForIds(ids)
  {
    if(!Item.isSetUped) Item.setUp();
    const db = BaseDB.getDB();
    const getMany = db.transaction(ids => 
    {
      const internalIds = [];
      const getId = db.prepare('SELECT internal_id FROM items WHERE id = @id');
      for(let id of ids)
      {
        const row = getId.get({id});
        internalIds.push(row? row.internal_id : null);
      }
      return internalIds;
    }
    )

    try
    {
      const response = getMany(ids);
      return response;
    }
    catch(error)
    {
      throw error;
    }
  }

  static getMissingIds(ids) {
    if (!ids.length) return [];

    const db = BaseDB.getDB();

    // Create the VALUES list: (?, ?), (?, ?), ...
    const valuesClause = ids.map(() => '(?)').join(', ');
    const query = `
      WITH input_ids(id) AS (
        VALUES ${valuesClause}
      )
      SELECT input_ids.id
      FROM input_ids
      LEFT JOIN items ON input_ids.id = items.id
      WHERE items.id IS NULL;
    `;

    const stmt = db.prepare(query);
    const result = stmt.all(...ids);

    return result.map(row => row.id);
  }
}