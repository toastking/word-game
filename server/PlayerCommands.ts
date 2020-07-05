import { Command } from "@colyseus/command";
import { Player, WordGameState } from "./GameRoom";
import { DrawTilesCommand } from "./TileCommands";

export class OnJoinCommand extends Command<
  WordGameState,
  { sessionId: string; name?: string }
> {
  execute({ sessionId, name }: this["payload"]) {
    const newPlayer = new Player(name);
    this.state.players[sessionId] = newPlayer;
    // populate the player hand
    return [new DrawTilesCommand().setPayload({ sessionId })];
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
    if (currentIdx === ids.length - 1) {
      return [new IncrementTurnCommand()];
    }
  }
}

/** Command to set the current turn when someone starts the game */
export class SetStartPlayerCommand extends Command<WordGameState, {}> {
  execute() {
    this.state.currentTurn = Object.keys(this.state.players)[0];
  }
}

/** Increments the turn counter */
export class IncrementTurnCommand extends Command<WordGameState, {}> {
  execute() {
    this.state.turn = this.state.turn + 1;
  }
}
