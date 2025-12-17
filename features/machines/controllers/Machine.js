import Joi from "joi";

// import Response from "../../../utils/Response.js";
// import { MachineBody } from "../entities/MachineBody.js";
// import { Machine as MachineEntity } from "../entities/Machine.js";
// import { Machine as MachineModel } from "../models/Machine.js";

export class Machine
{
  // static create(id, name)
  // {
  //   const machineData = {
  //     id: id.toString().trim(),
  //     name: name.trim()
  //   }
  //   const schema = Joi.object({
  //     id: MachineBody.idSchema.required(),
  //     name: MachineBody.nameSchema.required(),
  //   })

  //   const validationResponse = schema.validate(machineData)
  //   if(validationResponse.error)
  //   {
  //     return new Response(false, validationResponse.error.message);
  //   }

  //   const newMachine = new MachineBody(machineData.id, machineData.name);
  //   try
  //   {
  //     const response = MachineModel.create(newMachine);
  //     return new Response(true, null, response);
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message);
  //   }
  // }
  
  // static getAllMachines()
  // {
  //   try
  //   {
  //     const machines = MachineModel.getAllMachines();
  //     return new Response(true, null, machines);
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }

  // static getMachineByName(name)
  // {
  //   const machineData = {
  //     name: name.trim()
  //   }

  //   const schema = Joi.object({
  //     name: MachineBody.nameSchema
  //   })

  //   const validationResponse = schema.validate(machineData)
  //   if(validationResponse.error)
  //   {
  //     return new Response(false, validationResponse.error.message)
  //   }

  //   try
  //   {
  //     const machine = MachineModel.getMachineByName(machineData.name)
  //     if(!machine) 
	// 		{
	// 			return new Response(false, `لا يوجد ماكينة بهذا الإسم ${machineData.name}`)
	// 		}
  //     return new Response(true, null, machine)
  //   }
  //   catch(error)
  //   {
  //    return new Response(false, error.message)
  //   }
  // }

  // static getMachineById(id)
  // {
  //   const machineData = {
  //     id: id.toString().trim(),
  //   }
  //   const schema = Joi.object({
  //     id: MachineBody.idSchema,
  //   })

  //   const validationResponse = schema.validate(machineData)
  //   if(validationResponse.error)
  //   {
  //     return new Response(false, validationResponse.error.message)
  //   }

  //   try
  //   {
  //     const machine = MachineModel.getMachineById(id)
  //     if(!machine) 
	// 		{
	// 			return new Response(false, `لا يوجد ماكينة بهاذا الكود ${id}`)
	// 		}
  //     return new Response(true, null, machine)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }

  // static getMachinesItsNameContain(partialName)
  // {
  //   const machineData = {
  //     name: partialName
  //   }

  //   const schema = Joi.object({
  //     name: MachineBody.nameSearchSchema,
  //   })

  //   const validationResonse = schema.validate(machineData)
  //   if(validationResonse.error)
  //   {
  //     return new Response(false, validationResonse.error.message)
  //   }

  //   try
  //   {
  //     const machines = MachineModel.getMachinesItsNameContain(partialName)
  //     return new Response(true, null, machines)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }

  // static getMachinesItsIdContain(partialId)
  // {
  //   const machineData = {
  //     id: partialId
  //   }

  //   const schema = Joi.object({
  //     id: MachineBody.idSchema,
  //   })

  //   const validationResonse = schema.validate(machineData)
  //   if(validationResonse.error)
  //   {
  //     return new Response(false, validationResonse.error.message)
  //   }

  //   try
  //   {
  //     const machines = MachineModel.getMachinesItsIdContain(partialId)
  //     return new Response(true, null, machines)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }

  // static delete(id)
  // {
  //   const machineData = {
  //     id: id.trim()
  //   }
  //   const schema = Joi.object({
  //     id: MachineBody.idSchema.required()
  //   })

  //   const validationResponse = schema.validate(machineData)
  //   if(validationResponse.error)
  //   {
  //     return new Response(false, validationResponse.error.message)
  //   }
  //   try
  //   {
  //     const response = MachineModel.delete(id)
  //     return new Response(true, null, response)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }

  // static update(internalId, body)
  // {
  //   const machineData = {
  //     id: internalId,
  //     body: 
  //     {
  //       id: body.id.toString().trim(),
  //       name: body.name.trim()
  //     }
  //   }
  //   const schema = Joi.object({
  //     id: MachineEntity.idSchema.required(),
  //     body: Joi.object(
  //       {
  //         id: MachineBody.idSchema.required(),
  //       name: MachineBody.nameSchema.required(),
  //       }
  //     )
  //   })

  //   const validationResponse = schema.validate(machineData)
  //   if(validationResponse.error)
  //   {
  //     return new Response(false, validationResponse.error.message)
  //   }

  //   const machineBody = new MachineBody(machineData.body.id, machineData.body.name);
  //   const machine = new MachineEntity(machineData.id, machineBody);
  //   try
  //   {
  //     const response = MachineModel.update(machine)
  //     return new Response(true, null, response)
  //   }
  //   catch(error)
  //   {
  //     return new Response(false, error.message)
  //   }
  // }
}