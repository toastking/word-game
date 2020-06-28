import { Room } from "./__mocks__/colyseus";
import { WordGameState, Player } from "./GameRoom";
import { Dispatcher } from "@colyseus/command";
import { OnJoinCommand, OnLeaveCommand } from "./PlayerCommands";

describe("PlayerCommands", () => {
  let room: Room<WordGameState>;
  beforeEach(() => {
    room = new Room<WordGameState>();
    room.setState(new WordGameState());
  });

  test("OnJoinCommand adds player", () => {
    const dispatcher = new Dispatcher(room);
    dispatcher.dispatch(new OnJoinCommand(), { sessionId: "id", name: "Name" });

    const expectedPlayer = new Player();
    expectedPlayer.name = "Name";
    expect(room.state.players).toEqual({ id: expectedPlayer });
  });

  test("OnLeaveCommand removes player", () => {
    room.state.players["id"] = new Player();

    const dispatcher = new Dispatcher(room);
    dispatcher.dispatch(new OnLeaveCommand(), {
      sessionId: "id",
    });

    expect(room.state.players).toEqual({});
  });
});
