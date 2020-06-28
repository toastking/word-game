import { Command } from "@colyseus/command";
import { WordGameState, Player } from "./GameRoom";

export class OnJoinCommand extends Command<
  WordGameState,
  { sessionId: string; name?: string }
> {
  execute({ sessionId, name }: this["payload"]) {
    const newPlayer = new Player(name);
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

/** Command to increment the turn to the next player */
export class NextPlayerCommand extends Command<WordGameState, {}> {
  execute() {
    const ids = Object.keys(this.state.players);
    const currentIdx = ids.findIndex((id) => id === this.state.currentTurn);
    const nextIdx = (currentIdx + 1) % ids.length;
    this.state.currentTurn = ids[nextIdx];
  }
}
