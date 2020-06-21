import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

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
  onCreate(options: any) {
    //Set the intial State
    this.setState(new WordGameState());

    this.onMessage("type", (client, message) => {
      // handle "type" message
    });
  }

  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {}

  onDispose() {}
}
