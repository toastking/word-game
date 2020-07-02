import { Command } from "@colyseus/command";
import { PlacedTile, Tile, WordGameState, Player } from "./GameRoom";
import { ArraySchema } from "@colyseus/schema";
import { DrawTilesCommand, CreateDeckCommand } from "./TileCommands";
import { NextPlayerCommand, SetStartPlayerCommand } from "./PlayerCommands";

// Game board is 15x15 squares
export const BOARD_SIZE = 15;

/** Runs the commands to initialize the game */
export class OnCreateCommand extends Command<WordGameState, {}> {
  execute() {
    return [new InitializeGameBoardCommand(), new CreateDeckCommand()];
  }
}

/** Handles all the state initialization needed when starting a game */
export class OnGameStartCommand extends Command<WordGameState, {}> {
  execute() {
    this.room.lock();
    this.state.gameStarted = true;
    return [new SetStartPlayerCommand()];
  }
}

/** Command to set up the game board */
export class InitializeGameBoardCommand extends Command<WordGameState, {}> {
  execute() {
    // Add blank tiles to all the game boards
    for (let i = 0; i < BOARD_SIZE * BOARD_SIZE; i++) {
      this.state.gameBoard.push(new Tile());
    }
  }
}

/** Command to place a tile when a user requests it */
export class PlaceTileCommand extends Command<
  WordGameState,
  { tile: PlacedTile; sessionId: string }
> {
  validate({ tile }: this["payload"]) {
    // You can only place tiles on empty game board spaces
    return isEmptySpace(tile.row, tile.column, this.state.gameBoard);
  }

  execute({ tile, sessionId }: this["payload"]) {
    //Add the tile to the board and to the list of tiles
    this.state.gameBoard[calculatedIndex(tile.row, tile.column)] = tile.tile;
    this.state.placedTiles.push(tile);
    //Remove the tile from the players hand
    const player: Player = this.state.players[sessionId];
    const idxToRemove = player.hand.findIndex(
      (t) => t.letter === tile.tile.letter
    );
    (this.state.players[sessionId] as Player).hand.splice(idxToRemove, 1);
  }
}

/** Command to remove a tile */
export class RemoveTileCommand extends Command<
  WordGameState,
  { tile: PlacedTile; sessionId: string }
> {
  validate({ tile }: this["payload"]) {
    //TODO: add some validation to check if it's the players current turn
    // Check that it's actually in the list of placed tiles
    return this.state.placedTiles.some(
      (placedTile) =>
        placedTile.row === tile.row && placedTile.column === tile.column
    );
  }

  execute({ tile, sessionId }: this["payload"]) {
    const indexToRemove = this.state.placedTiles.findIndex(
      (placedTile) =>
        placedTile.row === tile.row && placedTile.column === tile.column
    );
    // If it found the value remove it from both the tile list and the game board
    if (indexToRemove >= 0) {
      this.state.placedTiles.splice(indexToRemove, 1);
      this.state.gameBoard.splice(
        calculatedIndex(tile.row, tile.column),
        1,
        new Tile()
      );

      //Add the removed tile to the players hand
      (this.state.players[sessionId] as Player).hand.push(tile.tile);
    }
  }
}

/** Checks the words the placed tiles make are valid words */
export class CheckWordsCommand extends Command<WordGameState, {}> {
  validate() {
    if (this.state.placedTiles.length === 0) {
      return false;
    }

    //Check that we have all the same rows or columns to see if the tiles are at a diagonal
    const hasDifferentRows = this.state.placedTiles.some(
      (tile) => this.state.placedTiles[0].row !== tile.row
    );
    const hasDifferentColumns = this.state.placedTiles.some(
      (tile) => this.state.placedTiles[0].column !== tile.column
    );
    if (hasDifferentColumns && hasDifferentRows) {
      return false;
    }

    return true;
  }

  execute() {
    const firstTile = this.state.placedTiles[0];
    const isHorizontal = this.state.placedTiles.every(
      (tile) => firstTile.row === tile.row
    );
    if (isHorizontal) {
      return [new BuildHorizontalWordCommand()];
    }

    // If it's not horizontal, given the validator, we can assume it's vertical
    return [new BuildVerticalWordCommand()];
  }
}

/** Build a word that's mainly horizontal */
export class BuildHorizontalWordCommand extends Command<WordGameState, {}> {
  validate() {
    //Check that the horizontal word intersection with other words
    const hasIntersections = this.state.placedTiles.some((tile) => {
      return (
        !isEmptySpace(tile.row + 1, tile.column, this.state.gameBoard) ||
        !isEmptySpace(tile.row - 1, tile.column, this.state.gameBoard)
      );
    });

    const firstTile: PlacedTile = this.state.placedTiles[0];
    const lastTile: PlacedTile = this.state.placedTiles[
      this.state.placedTiles.length - 1
    ];
    return (
      !isEmptySpace(
        firstTile.row,
        firstTile.column - 1,
        this.state.gameBoard
      ) ||
      !isEmptySpace(lastTile.row, lastTile.column + 1, this.state.gameBoard) ||
      !isEmptySpace(lastTile.row, lastTile.column + 1, this.state.gameBoard) ||
      hasIntersections
    );
  }

  execute() {
    const sortedPlacedTiles = [...this.state.placedTiles].sort(sortPlacedTiles);
    const words: Tile[][] = [];
    const firstPlacedTile: PlacedTile = sortedPlacedTiles[0];

    let columnCursor = firstPlacedTile.column;

    // Get the row of the horizontal word so we can check for vertical intersections
    const { row } = firstPlacedTile;
    //While it's an actual tile decremment the counter
    while (!isEmptySpace(row, columnCursor - 1, this.state.gameBoard)) {
      columnCursor--;
    }
    const startColumn = columnCursor;

    //Now find the end of the word
    const lastPlacedTile: PlacedTile =
      sortedPlacedTiles[sortPlacedTiles.length - 1];
    columnCursor = lastPlacedTile.column;

    while (!isEmptySpace(row, columnCursor + 1, this.state.gameBoard)) {
      columnCursor++;
    }
    const endColumn = columnCursor;

    for (let column = startColumn; column <= endColumn; column++) {
      // If the start index is not empty decrement the row as long as we can
      let innerStartCursor = row;
      while (
        !isEmptySpace(innerStartCursor - 1, column, this.state.gameBoard)
      ) {
        innerStartCursor--;
      }

      let innerEndCursor = row;
      while (!isEmptySpace(innerEndCursor + 1, column, this.state.gameBoard)) {
        innerEndCursor++;
      }

      // Check if a word was actually formed, if it was then we append the word list
      if (innerStartCursor !== innerEndCursor) {
        const word: Tile[] = [];
        for (let row = innerStartCursor; row <= innerEndCursor; row++) {
          word.push(this.state.gameBoard[calculatedIndex(row, column)]);
        }
        words.push(word);
      }
    }

    // Add the placed word to the list of letters
    words.push(this.state.placedTiles.map((placedTile) => placedTile.tile));

    // Set off the scoring  action
    return [new AddToPlayerScore().setPayload({ words })];
  }
}

/** Build a word that's mainly vertical */
export class BuildVerticalWordCommand extends Command<WordGameState, {}> {
  validate() {
    //Check that the horizontal word intersection with other words
    const hasIntersections = this.state.placedTiles.some((tile) => {
      return (
        !isEmptySpace(tile.row, tile.column - 1, this.state.gameBoard) ||
        !isEmptySpace(tile.row, tile.column + 1, this.state.gameBoard)
      );
    });

    const firstTile: PlacedTile = this.state.placedTiles[0];
    const lastTile: PlacedTile = this.state.placedTiles[
      this.state.placedTiles.length - 1
    ];
    return (
      !isEmptySpace(
        firstTile.row,
        firstTile.column - 1,
        this.state.gameBoard
      ) ||
      !isEmptySpace(lastTile.row, lastTile.column + 1, this.state.gameBoard) ||
      !isEmptySpace(lastTile.row, lastTile.column + 1, this.state.gameBoard) ||
      hasIntersections
    );
  }

  execute() {
    const sortedPlacedTiles = [...this.state.placedTiles].sort(sortPlacedTiles);
    const words: Tile[][] = [];

    //Get the start row for the word
    const firstPlacedTile: PlacedTile = sortedPlacedTiles[0];
    const startRow = firstPlacedTile.row;
    //Now find the end of the word
    const lastPlacedTile: PlacedTile =
      sortedPlacedTiles[sortPlacedTiles.length - 1];
    const endRow = lastPlacedTile.row;

    let column = firstPlacedTile.column;
    for (let row = startRow; row <= endRow; row++) {
      // If the start index is not empty decrement the row as long as we can
      let innerStartCursor = column;
      while (!isEmptySpace(row, innerStartCursor - 1, this.state.gameBoard)) {
        innerStartCursor--;
      }

      let innerEndCursor = column;
      while (!isEmptySpace(row, innerEndCursor + 1, this.state.gameBoard)) {
        innerEndCursor++;
      }

      // Check if a word was actually formed, if it was then we append the word list
      if (innerStartCursor !== innerEndCursor) {
        const word: Tile[] = [];
        for (
          let column = innerStartCursor;
          column <= innerEndCursor;
          column++
        ) {
          word.push(this.state.gameBoard[calculatedIndex(row, column)]);
        }
        words.push(word);
      }
    }

    // Add the placed word to the list of letters
    words.push(this.state.placedTiles.map((placedTile) => placedTile.tile));

    // Set off the scoring  action
    return [new AddToPlayerScore().setPayload({ words })];
  }
}

/** Add a word the current players score */
export class AddToPlayerScore extends Command<
  WordGameState,
  { words: Tile[][] }
> {
  execute({ words }: this["payload"]) {
    const wordScore = words
      .map((word) => word.map((tile) => tile.points))
      .reduce(
        (sum, points) =>
          sum + points.reduce((innerSum, point) => innerSum + point),
        0
      );
    const player: Player = this.state.players[this.state.currentTurn];
    (this.state.players[this.state.currentTurn] as Player).score =
      player.score + wordScore;

    // Kick off the next actions for the turn
    return [
      (new DrawTilesCommand().setPayload({ sessionId: this.state.currentTurn }),
      new CheckForGameOverComand(),
      new NextPlayerCommand()),
    ];
  }
}

/** Checks if it's game over, if it is does the final scoring and state changes */
export class CheckForGameOverComand extends Command<WordGameState, {}> {
  execute() {
    if (this.state.tileDeck.length === 0) {
      this.state.gameOver = true;
    }
  }
}

/** Helper function to sort the placed tiles */
function sortPlacedTiles(tileA: PlacedTile, tileB: PlacedTile) {
  if (
    tileA.row < tileB.row ||
    (tileA.row === tileB.row && tileA.column < tileB.column)
  ) {
    return -1;
  }

  if (
    tileA.row > tileB.row ||
    (tileA.row === tileB.row && tileA.column > tileB.column)
  ) {
    return 1;
  }

  return 0;
}

/** Helper function to calculate a 1d index from 2d dimensions */
export function calculatedIndex(row: number, column: number): number {
  return BOARD_SIZE * row + column;
}

/** If a space one a board is an empty tile and does not have a tile places there */
function isEmptySpace(row: number, column: number, board: ArraySchema<Tile>) {
  if (row < 0 || column < 0 || row >= BOARD_SIZE || column >= BOARD_SIZE) {
    return true;
  }
  return board[calculatedIndex(row, column)].points === -1;
}
