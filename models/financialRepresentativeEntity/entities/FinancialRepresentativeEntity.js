import Joi from "joi"

export class FinancialRepresentativeEntity
{
  static entityIdSchema =  Joi
    .string()
    .trim()
    .min(1)
    .max(100)
    .pattern(/^[0-9]{1,100}$/)

  static nameSchema = Joi
    .string()
    .trim()
    .min(3)
    .max(100)
}