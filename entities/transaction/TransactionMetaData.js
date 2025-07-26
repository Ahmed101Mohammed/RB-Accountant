import Joi from 'joi';
import { isValid } from '../utils/isValid.js';

export class TransactionMetaData 
{
  #date;
  #comment = "";
  static dateSchema = Joi
    .string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd')
    .messages({
        'string.pattern.name': 'يجب أن يكون التاريخ بصيغة yyyy-mm-dd',
        'string.empty': 'حقل التاريخ مطلوب',
        'any.required': 'هذا الحقل مطلوب'
      });
  static commentSchema = Joi
  .string()
  .max(150)
  .allow("")
  .messages({
    'string.base': 'يجب أن يكون البيان نصا',
    'string.max': 'البيان يجب أن لا يتجاوز 150 حرفا'
  })
  constructor(date, comment)
  {
    this.setDate(date)
    this.setComment(comment)
  }

  setDate(date)
  {
    date = date.trim()
    const schema = TransactionMetaData.dateSchema.required();
    const isValidDate= isValid(schema, date);
    if(!isValidDate[0]) throw new Error(isValidDate[1].message)
    this.#date= isValidDate[1];
  }

  setComment(comment)
  {
    comment = comment.trim()
    const schema = TransactionMetaData.commentSchema.required();
    const isValidComment= isValid(schema, comment);
    if(!isValidComment[0]) throw new Error(isValidComment[1].message)
    this.#comment= isValidComment[1];
  }

  getDate()
  {
    return this.#date
  }

  getComment()
  {
    return this.#comment
  }

  toJson()
  {
    return {
      date: this.getDate(),
      comment: this.getComment(),
    }
  }

  static isTransactionMetaData(object)
  {
    return object instanceof TransactionMetaData
  }
}