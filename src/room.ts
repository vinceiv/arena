import { playerModel } from './models/playerModel';

/*  The Server will funnel users into seperate rooms
*   These rooms will be an instance of the game server.
*/
export class room {

  private _players: playerModel[] = [];
  private _timeline: any; //Not implemented will be Obj states[]; to roll back in time/deal with interpolation
  private _creationTimeStamp: any;
  private _scoreBoard: [string,number][] = []; //NOT PART OF CORE

  constructor(){
    this._creationTimeStamp = new Date().getTime() / 1000;
  }

  public addPlayer(socket: any){
    //Create new player obj save socket.id to player id
    console.log("Added Client to room 1: %s", socket.id);
  }
  /* Unimplemented methods, drop ideas */
  public getUptime(){} //Return formatted difference from current time and creationTimeStamp
  public getPlayers(){} //Return Qty of players in server
  public getScoreboard(){} //Return Scoreboard, NOT PART OF CORE
  public tearDownRoom(){}
}
