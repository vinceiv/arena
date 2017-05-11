import { playerModel } from './models/playerModel';
import { utils } from './utils/utils';
import * as io from "socket.io";
/*  The Server will funnel users into seperate rooms
*   These rooms will be an instance of the game server.
*/
export class room {

  private _identifier: string;
  private _timeline: any; //Not implemented will be Obj states[]; to roll back in time/deal with interpolation
  private _creationTimeStamp: any;
  private _io: any;
  private _MAXPLAYERS: number;
  private _playerCount: number;
  private _UPDATEINTERVAL: number;
  private _scoreBoard: [string,number][] = []; //NOT PART OF CORE
  private _playerMap: {[key:string]:playerModel} = {};
  //private _chat: chat; Not implemented bing a chat room to a game
  private _utils = utils.getInstance();

  //These options would be unique to every game or subset of games
  private _GAMEOPTIONS = {MAXMOVEMENT: 3, MAXHEALTH: 100};

  //Probably a much better way to do this
  //Event emitter will update as it send outs packets it will allow packets to come in
  private _floodGates = false;

  constructor(serverIO: any, opts?: {identifier: string, maxplayers: number, updateinterval: number}){
    this._io = io(serverIO);
    this._creationTimeStamp = new Date().getTime();
    this._identifier = opts && opts.identifier || this.randomName();
    this._MAXPLAYERS = opts && opts.maxplayers || 60;
    this._UPDATEINTERVAL = opts && opts.updateinterval || 30; //30fps
    this.updateEmiter();
  }

  private updateEmiter(): void {
    let self = this;
    setInterval(function () {
        self._io.socket.emit('update');
        self._floodGates = true;
    }, 33);
  }

  /*
  * Listener sits on the socket and handles all communication to and from the Room
  */
  private listener(socket: any){
    /* Client would call requestNewPlayer
    *  Room creates player obj and returns player and current state of the game
    */
    socket.on('requestNewPlayer', () => {
      console.log('User: ' + socket.id + ' connected to room: ' + this._identifier);
      var player = new playerModel();
      this._playerMap[socket.id] = player;
      socket.emit('confirmedUser', player); // Just for sake of testing, would be something like socket.emit('confirmedUser', p);
    });

    //need to write data model for update obj
    socket.on('updates', (update: any) => {
      //Need to limit to update rate and check for validity of update
      if (this._floodGates === true) {
        if(this._utils.getDifference(this._playerMap[socket.id].getX(), update.x) < this._GAMEOPTIONS.MAXMOVEMENT &&
        this._utils.getDifference(this._playerMap[socket.id].getX(), update.x) < this._GAMEOPTIONS.MAXMOVEMENT){
          this._playerMap[socket.id].setX(update.x);
          this._playerMap[socket.id].setY(update.y);
        }
      }
    });

    socket.on('getStats', () => {
      this.dumpStats();
    });

    socket.on('disconnect', () =>{
      this._playerCount--;
      //this._playerMap.delete(key:value); need to use es6 for map class
    });
  }

  // Connect player is in limbo
  // Client must call requestNewPlayer to receive player Obj and add
  // player to map
  public addPlayer(socket: any){
    //Create new player obj save socket.id to player id
    console.log("Added Client to room: %s", socket.id);
    this._playerCount++;
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

  public getPlayerCount(): number { return this._playerCount }

  public dumpStats(): void {
    console.log('Server: ' , this._identifier);
    console.log('Players: ', this._playerCount);
  }

  private randomName(): string {
    return 'mew';
  }

  /* Unimplemented methods, drop ideas */
  public tearDownRoom(){}

  /* Example of extensibility
  * Function is not part of CORE
  */
  public getScoreboard(){} //Return Scoreboard, NOT PART OF CORE
  public kickPlayer(){}
  public resetServer(){}
}

/* NOTES
*  Server output rate and game fps must sync for smooth play
*   -Player sends new position to server
*   -Server validates player can move there and move there that fast
*   -Example check distance between current.y and past.y if dist > X then deny
*   -Player receives full game state when movement flags error
*   -Add possible bad connection handler
*/
