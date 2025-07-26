export const isValid = (JoiSchema, val) =>
{
  const {error, value} = JoiSchema.validate(val)
  if(error) return [false, error]
  return [true, value]
}