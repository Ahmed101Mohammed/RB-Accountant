export class ErrorHandler
{
  static logError(error)
  {
    const name = error.name
    const message = error.message
    console.log(`Error=> ${name}: ${message}`)
  }
}