import * as http from "http";
import * as io from "socket.io";
import * as express from "express";
import * as clientRoutes from './routes/clientRoutes';

import { playerModel } from './models/playerModel';
import { room } from './room';

class Server {

    public express: express.Application;
    public static readonly PORT = 8080;
    public app: express.Application;
    private server: any;
    private io: any;
    private port: number;

    private _rooms: room[] = [];
    private _MAXROOMS: number = 10;

    constructor(){
      this.app = express();
      this.port = 8080;
      this.server = http.createServer(this.app);
      this.io = io(this.server);
      this.listener();
      this.setupRoutes();
    }

    public static bootstrap(): Server{
      return new Server();
    }

    private setupRoutes(): void {
       this.app.get("/", (req: any, res: any)=> {
         res.sendFile(__dirname + '/example/index.html');
       }).use(express.static(__dirname + '/example/'));
    }

    private listener(): void {
      this.server.listen(this.port, () => {
        console.log("Server Running Port %s", this.port);
      });

      this.io.on('connection', (socket: any) => {
        console.log('Client connecton on port %s \nClientID: %s', this.port, socket.id);

        // TESTING
        if(!this.createRoom()){
          //ERROR CREATING ROOM THROW ERROR
        } //Move this to admin function or client facing , maybe check if room exists if not create room
        this._rooms[0].addPlayer(socket);

        socket.on('message', () => {
            this.io.emit('message');
        });
        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
        // TESTING
      });
    }
    //Pass options Obj, Max PLayers, etc
    public createRoom(): boolean {
      if (this._rooms.length < this._MAXROOMS){
        let newRoom: room = new room(this.io);
        this._rooms.push(newRoom);
        return true;
      } return false;
    }
  /* Admin functions
  *  auth and admin cli panel to come.
  *  Add Stats, rooms, players, uptime, etc.
  */
}

let server = Server.bootstrap();
export { server };
