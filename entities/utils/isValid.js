isValid(JoiSchema, val)
{
  const {error, value} = schema.validate(val)
  if(error) return [false, error]
  return [true, value]
}

export default isValid;