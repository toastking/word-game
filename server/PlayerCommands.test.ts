import { Room } from "./mock/colyseus";
import { WordGameState, Player } from "./GameRoom";
import { Dispatcher } from "@colyseus/command";
import {
  OnJoinCommand,
  OnLeaveCommand,
  NextPlayerCommand,
} from "./PlayerCommands";
import { CreateDeckCommand } from "./TileCommands";

describe("PlayerCommands", () => {
  let room: Room<WordGameState>;
  beforeEach(() => {
    room = new Room<WordGameState>();
    room.setState(new WordGameState());
  });

  test("OnJoinCommand adds player and populates hand", () => {
    const dispatcher = new Dispatcher(room);
    dispatcher.dispatch(new CreateDeckCommand());
    dispatcher.dispatch(new OnJoinCommand(), { sessionId: "id", name: "Name" });

    const updatedPlayer: Player = room.state.players["id"];
    expect(updatedPlayer.name).toBe("Name");
    expect(updatedPlayer.score).toBe(0);
    expect(updatedPlayer.hand.length).toBe(7);
  });

  test("OnLeaveCommand removes player", () => {
    room.state.players["id"] = new Player();

    const dispatcher = new Dispatcher(room);
    dispatcher.dispatch(new OnLeaveCommand(), {
      sessionId: "id",
    });

    expect(room.state.players).toEqual({});
  });

  test("NextPlayerCommand goes to the next player", () => {
    room.state.players["id"] = new Player();
    room.state.players["id2"] = new Player();
    room.state.currentTurn = "id";

    const dispatcher = new Dispatcher(room);
    dispatcher.dispatch(new NextPlayerCommand());

    expect(room.state.currentTurn).toBe("id2");
  });
});
