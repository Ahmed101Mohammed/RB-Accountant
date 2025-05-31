import Joi from 'joi';

class TransactionMetaData 
{
  #date;
  #comment = "";
  static dateSchema = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/, 'صيغة التاريخ yyyy-mm-dd');
  static commentSchema = Joi.string().max(150).allow('')
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

  static isTransactionMetaData(object)
  {
    return object instanceof TransactionMetaData
  }
}

export default TransactionMetaData