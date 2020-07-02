import { Room } from "./mock/colyseus";
import { WordGameState, Player } from "./GameRoom";
import { Dispatcher } from "@colyseus/command";
import { CreateDeckCommand, DrawTilesCommand } from "./TileCommands";

describe("TileCommands", () => {
  let room: Room<WordGameState>;
  beforeEach(() => {
    room = new Room<WordGameState>();
    room.setState(new WordGameState());
  });

  test("draws a random hand for a player", () => {
    const state = new WordGameState();
    state.players["id"] = new Player();
    //Initialize the deck
    const dispatcher = new Dispatcher({ state });
    dispatcher.dispatch(new CreateDeckCommand());

    //Then draw cards for the player
    dispatcher.dispatch(new DrawTilesCommand(), { sessionId: "id" });
  });
});
