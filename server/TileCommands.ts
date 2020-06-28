import { Command } from "@colyseus/command";
import { WordGameState, Tile, Player } from "./GameRoom";
import { ArraySchema } from "@colyseus/schema";

interface LetterMapping {
  letter: string;
  points: number;
  occurences: number;
}
/** The letter, points value, and number of tiles, for all the letters in the game */
const letters: LetterMapping[] = [
  { letter: "A", points: 1, occurences: 9 },
  { letter: "B", points: 3, occurences: 2 },
  { letter: "C", points: 3, occurences: 2 },
  { letter: "D", points: 2, occurences: 4 },
  { letter: "E", points: 1, occurences: 12 },
  { letter: "F", points: 4, occurences: 2 },
  { letter: "G", points: 2, occurences: 3 },
  { letter: "H", points: 4, occurences: 2 },
  { letter: "I", points: 1, occurences: 9 },
  { letter: "J", points: 8, occurences: 1 },
  { letter: "K", points: 5, occurences: 1 },
  { letter: "L", points: 1, occurences: 4 },
  { letter: "M", points: 3, occurences: 2 },
  { letter: "N", points: 1, occurences: 6 },
  { letter: "O", points: 1, occurences: 8 },
  { letter: "P", points: 3, occurences: 2 },
  { letter: "Q", points: 10, occurences: 1 },
  { letter: "R", points: 1, occurences: 6 },
  { letter: "S", points: 1, occurences: 4 },
  { letter: "T", points: 1, occurences: 6 },
  { letter: "U", points: 1, occurences: 4 },
  { letter: "V", points: 4, occurences: 2 },
  { letter: "W", points: 4, occurences: 2 },
  { letter: "X", points: 8, occurences: 1 },
  { letter: "Y", points: 4, occurences: 2 },
  { letter: "Z", points: 10, occurences: 1 },
  { letter: "", points: 0, occurences: 2 },
];

/** Command to create the deck of tiles at the start of the game */
export class CreateDeckCommand extends Command<WordGameState, {}> {
  execute() {
    //Cleare the tiledeck just in case
    this.state.tileDeck.splice(0, this.state.tileDeck.length);

    //Create the deck of tiles from the mapping
    for (let mapping of letters) {
      for (let i = 0; i < mapping.occurences; i++) {
        const tile = new Tile();
        tile.letter = mapping.letter;
        tile.points = mapping.points;
        this.state.tileDeck.push(tile);
      }
    }
  }
}

/** Max number of tiles in hand */
export const MAX_HAND = 7;

/** Command to draw tiles after the user has taken them from their hand */
export class DrawTilesCommand extends Command<
  WordGameState,
  { sessionId: string }
> {
  execute({ sessionId }: this["payload"]) {
    const player: Player = this.state.players[sessionId];
    const toDraw = MAX_HAND - player.hand.length;
    for (let i = 0; i < toDraw; i++) {
      const randomIdx = Math.floor(Math.random() * this.state.tileDeck.length);
      const drawnTile = this.state.tileDeck.splice(randomIdx, 1);
      (this.state.players[sessionId] as Player).hand.push(drawnTile);
    }
  }
}
