import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";
import { Dispatcher } from "@colyseus/command";
import { OnJoinCommand } from "./PlayerCommands";

export class Player extends Schema {
  @type("string")
  name: String;
}

export class WordGameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  //Id of the current player who's turn is it
  @type("string")
  currentTurn: string;
}

export class GameRoom extends Room<WordGameState> {
  readonly dispatcher = new Dispatcher(this);

  onCreate(options: any) {
    console.log("created");
    //Set the intial State
    this.setState(new WordGameState());

    this.onMessage("type", (client, message) => {
      // handle "type" message
    });
  }

  onJoin(client: Client, options: any) {
    console.log("joined");
    this.dispatcher.dispatch(new OnJoinCommand(), {
      sessionId: client.sessionId,
      name: options?.name,
    });
  }

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
