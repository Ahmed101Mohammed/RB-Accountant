class Response
{
  #state;
  #message;
  #data;
  constructor(state, message, data)
  {
    this.#state = state
    this.#message = message
    this.#data = data
  }

  getState()
  {
    return this.#state
  }

  getMessage()
  {
    return this.#message
  }

  getData()
  {
    return this.#data
  }

  toJson()
  {
    let dataInJson = []
    if(this.#data instanceof Array)
    {
      if(this.#data.length && !this.#data[0].toJson) 
      {
        dataInJson = this.#data
      }
      else
      {
        for(let dataUnit of this.#data)
        {
          if(dataUnit instanceof Object)
          {
            dataInJson.push(dataUnit.toJson())
          }
        }
      }
    }
    else if(this.#data && this.#data.toJson)
    {
      dataInJson.push(this.#data.toJson())
    }
    else
    {
      dataInJson.push(this.#data)
    }

    return {
      state: this.#state,
      message: this.#message,
      data: dataInJson
    }
		
  }
}

export default Response
