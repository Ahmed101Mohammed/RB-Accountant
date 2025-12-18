import Joi from "joi";

// import Response from "../../../utils/Response.js";
// import { EmployeeBody } from "../../../entities/employee/EmployeeBody.js";
// import { Employee as EmployeeEntity } from "../../../entities/employee/Employee.js";
// import { Employee as EmployeeModel } from "../../../models/Employee.js";

export class Employee
{
  // static create(id, name)
  // {
  //   const employeeData = {
  //     id: id.toString().trim(),
  //     name: name.trim()
  //   }
  //   const schema = Joi.object({
  //     id: EmployeeBody.idSchema.required(),
  //     name: EmployeeBody.nameSchema.required(),
  //   })

  //   const validationResponse = schema.validate(employeeData)
  //   if(validationResponse.error)
  //   {
  //     return new Response(false, validationResponse.error.message)
  //   }

  //   const newEmployee = new EmployeeBody(employeeData.id, employeeData.name)
  //   try
  //   {
  //     const response = EmployeeModel.create(newEmployee)
  //     return new Response(true, null, response)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }
  
  // static getAllEmployees()
  // {
  //   try
  //   {
  //     const employees = EmployeeModel.getAllEmployees()
  //     return new Response(true, null, employees)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }

  // static getEmployeeByName(name)
  // {
  //   const employeeData = {
  //     name: name.trim()
  //   }

  //   const schema = Joi.object({
  //     name: EmployeeBody.nameSchema
  //   })

  //   const validationResponse = schema.validate(employeeData)
  //   if(validationResponse.error)
  //   {
  //     return new Response(false, validationResponse.error.message)
  //   }

  //   try
  //   {
  //     const employee = EmployeeModel.getEmployeeByName(employeeData.name)
  //     if(!employee) 
	// 		{
	// 			return new Response(false, `لا يوجد موظف بهذا الإسم ${employeeData.name}`)
	// 		}
  //     return new Response(true, null, employee)
  //   }
  //   catch(error)
  //   {
  //    return new Response(false, error.message)
  //   }
  // }

  // static getEmployeeById(id)
  // {
  //   const employeeData = {
  //     id: id.toString().trim(),
  //   }
  //   const schema = Joi.object({
  //     id: EmployeeBody.idSchema,
  //   })

  //   const validationResponse = schema.validate(employeeData)
  //   if(validationResponse.error)
  //   {
  //     return new Response(false, validationResponse.error.message)
  //   }

  //   try
  //   {
  //     const employee = EmployeeModel.getEmployeeById(id)
  //     if(!employee) 
	// 		{
	// 			return new Response(false, `لا يوجد موظف بهاذا الكود ${id}`)
	// 		}
  //     return new Response(true, null, employee)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }

  // static getEmployeesItsNameContain(partialName)
  // {
  //   const employeeData = {
  //     name: partialName
  //   }

  //   const schema = Joi.object({
  //     name: EmployeeBody.nameSchema,
  //   })

  //   const validationResonse = schema.validate(employeeData)
  //   if(validationResonse.error)
  //   {
  //     return new Response(false, validationResonse.error.message)
  //   }

  //   try
  //   {
  //     const employees = EmployeeModel.getEmployeesItsNameContain(partialName)
  //     return new Response(true, null, employees)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }

  // static getEmployeesItsIdContain(partialId)
  // {
  //   const employeeData = {
  //     id: partialId
  //   }

  //   const schema = Joi.object({
  //     id: EmployeeBody.idSchema,
  //   })

  //   const validationResonse = schema.validate(employeeData)
  //   if(validationResonse.error)
  //   {
  //     return new Response(false, validationResonse.error.message)
  //   }

  //   try
  //   {
  //     const employees = EmployeeModel.getEmployeesItsIdContain(partialId)
  //     return new Response(true, null, employees)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }

  // static delete(id)
  // {
  //   const employeeData = {
  //     id: id.toString().trim()
  //   }
  //   const schema = Joi.object({
  //     id: EmployeeBody.idSchema.required()
  //   })

  //   const validationResponse = schema.validate(employeeData)
  //   if(validationResponse.error)
  //   {
  //     return new Response(false, validationResponse.error.message)
  //   }
  //   try
  //   {
  //     const response = EmployeeModel.delete(id)
  //     return new Response(true, null, response)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }

  // static update(internalId, body)
  // {
  //   const employeeData = {
  //     id: internalId,
  //     body: 
  //     {
  //       id: body.id.toString().trim(),
  //       name: body.name.trim()
  //     }
  //   }
  //   const schema = Joi.object({
  //     id: EmployeeEntity.idSchema.required(),
  //     body: Joi.object(
  //       {
  //         id: EmployeeBody.idSchema.required(),
  //       name: EmployeeBody.nameSchema.required(),
  //       }
  //     )
  //   })

  //   const validationResponse = schema.validate(employeeData)
  //   if(validationResponse.error)
  //   {
  //     return new Response(false, validationResponse.error.message)
  //   }

  //   const employeeBody = new EmployeeBody(employeeData.body.id, employeeData.body.name);
  //   const employee = new EmployeeEntity(employeeData.id, employeeBody);
  //   try
  //   {
  //     const response = EmployeeModel.update(employee)
  //     return new Response(true, null, response)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }
}