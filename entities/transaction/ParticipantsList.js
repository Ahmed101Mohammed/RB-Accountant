import {LightParticipant} from "./LightParticipant.js";
import {Participant} from "./Participant.js";

export class ParticipantsList
{
  #participants = [];
  #listType
  push(participant)
  {
    if(this.#participants.length === 0)
    {
      if(participant instanceof Participant)
      {
        this.#participants.push(participant);
        this.#listType = Participant;
      }
      else if(participant instanceof LightParticipant)
      {
        this.#participants.push(participant);
        this.#listType = LightParticipant
      }
      else throw new Error(`ParticipantList just accept objects instance of Participant or LightParticipant class`)
    }
    else
    {
      if(participant instanceof this.#listType)
      {
        this.#participants.push(participant)
      } 
      else throw new Error(`This ParticipantList jsut accept objects instance of ${this.#listType.name}`)
    }
  }

  toJson()
  {
    return this.participants.map(particpant => particpant.toJson());
  }

  get participants()
  {
    return this.#participants;
  }

  static isParticipantList(object)
  {
    return object instanceof ParticipantsList
  }
}