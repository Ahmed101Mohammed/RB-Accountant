export const currentDate = ()=>
{
  const toDay = new Date()
  return `${toDay.getFullYear()}-${(toDay.getMonth()+1).toString().padStart(2, '0')}-${toDay.getDate().toString().padStart(2, '0')}`
}