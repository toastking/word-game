import { Command } from "@colyseus/command";
import { WordGameState, Player } from "./GameRoom";

export class OnJoinCommand extends Command<
  WordGameState,
  { sessionId: string; name?: string }
> {
  execute({ sessionId, name }: this["payload"]) {
    const newPlayer = new Player();
    newPlayer.name = name;
    this.state.players[sessionId] = newPlayer;
  }
}

export class OnLeaveCommand extends Command<
  WordGameState,
  { sessionId: string }
> {
  execute({ sessionId }: this["payload"]) {
    delete this.state.players[sessionId];
  }
}
