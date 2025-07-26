import Joi from "joi";

import Response from "../../../utils/Response.js";
import { ItemBody } from "../entities/ItemBody.js";
import { Item as ItemEntity } from "../entities/Item.js";
import { Item as ItemModel } from "../models/Item.js";

export class Item
{
  static create(id, name)
  {
    const itemData = {
      id: id.toString().trim(),
      name: name.trim()
    }
    const schema = Joi.object({
      id: ItemBody.idSchema.required(),
      name: ItemBody.nameSchema.required(),
    })

    const validationResponse = schema.validate(itemData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message);
    }

    const newItem = new ItemBody(itemData.id, itemData.name);
    try
    {
      const response = ItemModel.create(newItem);
      return new Response(true, null, response);
    }
    catch(error)
    {
      return new Response(false, error.message);
    }
  }
  
  static getAllItems()
  {
    try
    {
      const items = ItemModel.getAllItems();
      return new Response(true, null, items);
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getItemByName(name)
  {
    const itemData = {
      name: name.trim()
    }

    const schema = Joi.object({
      name: ItemBody.nameSchema
    })

    const validationResponse = schema.validate(itemData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    try
    {
      const item = ItemModel.getItemByName(itemData.name)
      if(!item) 
			{
				return new Response(false, `لا يوجد صنف بهذا الإسم ${itemData.name}`)
			}
      return new Response(true, null, item)
    }
    catch(error)
    {
     return new Response(false, error.message)
    }
  }

  static getItemById(id)
  {
    const itemData = {
      id: id.toString().trim(),
    }
    const schema = Joi.object({
      id: ItemBody.idSchema,
    })

    const validationResponse = schema.validate(itemData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    try
    {
      const item = ItemModel.getItemById(id)
      if(!item) 
			{
				return new Response(false, `لا يوجد صنف بهاذا الكود ${id}`)
			}
      return new Response(true, null, item)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getItemsItsNameContain(partialName)
  {
    const itemData = {
      name: partialName
    }

    const schema = Joi.object({
      name: ItemBody.nameSearchSchema,
    })

    const validationResonse = schema.validate(itemData)
    if(validationResonse.error)
    {
      return new Response(false, validationResonse.error.message)
    }

    try
    {
      const items = ItemModel.getItemsItsNameContain(partialName)
      return new Response(true, null, items)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static getItemsItsIdContain(partialId)
  {
    const itemData = {
      id: partialId
    }

    const schema = Joi.object({
      id: ItemBody.idSchema,
    })

    const validationResonse = schema.validate(itemData)
    if(validationResonse.error)
    {
      return new Response(false, validationResonse.error.message)
    }

    try
    {
      const items = ItemModel.getItemsItsIdContain(partialId)
      return new Response(true, null, items)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static delete(id)
  {
    const itemData = {
      id: id.toString().trim()
    }
    const schema = Joi.object({
      id: ItemBody.idSchema.required()
    })

    const validationResponse = schema.validate(itemData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }
    try
    {
      const response = ItemModel.delete(id)
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }

  static update(internalId, body)
  {
    const itemData = {
      id: internalId,
      body: 
      {
        id: body.id.toString().trim(),
        name: body.name.trim()
      }
    }
    const schema = Joi.object({
      id: ItemEntity.idSchema.required(),
      body: Joi.object(
        {
          id: ItemBody.idSchema.required(),
        name: ItemBody.nameSchema.required(),
        }
      )
    })

    const validationResponse = schema.validate(itemData)
    if(validationResponse.error)
    {
      return new Response(false, validationResponse.error.message)
    }

    const itemBody = new ItemBody(itemData.body.id, itemData.body.name);
    const item = new ItemEntity(itemData.id, itemBody);
    try
    {
      const response = ItemModel.update(item)
      return new Response(true, null, response)
    }
    catch(error)
    {
      return new Response(false, error.message)
    }
  }
}