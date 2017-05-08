import { playerModel } from './models/playerModel';
import * as io from "socket.io";
/*  The Server will funnel users into seperate rooms
*   These rooms will be an instance of the game server.
*/
export class room {

  private _timeline: any; //Not implemented will be Obj states[]; to roll back in time/deal with interpolation
  private _creationTimeStamp: any;
  private _scoreBoard: [string,number][] = []; //NOT PART OF CORE
  private _io: any;
  private _players: playerModel[] = [];
  // private _chat: chat; Not implemented bing a chat room to a game

  constructor(serverIO: any){
    this._io = io(serverIO);
    this._creationTimeStamp = new Date().getTime();
  }

  /*
  * Listener sits on the socket and handles all communication to and from the Room
  */
  private listener(socket: any){
    /* Client would call requestNewPlayer
    *  Room creates player obj and returns player and current state of the game
    */
    socket.on('requestNewPlayer', () => {
      console.log('User: ' + socket.id + ' connected.');
      var newPlayer = new playerModel(); //Example
      this._players.push(newPlayer);
      socket.emit('confirmedUser'); // Just for sake of testing, would be something like socket.emit('confirmedUser', p);
    });

    socket.on('getUpTime', () => {
      console.log('Uptime:', this.getUptime());
    });
  }

  public addPlayer(socket: any){
    //Create new player obj save socket.id to player id
    console.log("Added Client to room 1: %s", socket.id);
    //pass socket to listener
    this.listener(socket);
  }

  public getUptime(): any {
    let currentTime: number = new Date().getTime();
    var hourDiff = currentTime - this._creationTimeStamp; //in ms
    var secDiff = hourDiff / 1000; //in s
    var minDiff = hourDiff / 60 / 1000; //in minutes
    var hDiff = hourDiff / 3600 / 1000; //in hours
    var readable = {hours: 0, minutes: 0 };
    readable.hours = Math.floor(hDiff);
    readable.minutes = minDiff - 60 * readable.hours;
    return readable;
  }

  public getPlayerCount(): number { return this._players.length }

  /* Unimplemented methods, drop ideas */
  public getScoreboard(){} //Return Scoreboard, NOT PART OF CORE
  public tearDownRoom(){}
}

/* NOTES
*  Server output rate and game fps must sync for smooth play
*   -Player sends new position to server
*   -Server validates player can move there and move there that fast
*   -Example check distance between current.y and past.y if dist > X then deny
*   -Player receives full game state when movement flags error
*   -Add possible bad connection handler
*/
