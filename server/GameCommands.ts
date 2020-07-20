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
      const tile = new Tile();
      this.state.gameBoard.push(tile);
    }
  }
}

/** Command to place a tile when a user requests it */
export class PlaceTileCommand extends Command<
  WordGameState,
  { tile: PlacedTile; sessionId: string }
> {
  validate({ tile, sessionId }: this["payload"]) {
    if (this.state.currentTurn !== sessionId) {
      return false;
    }
    // You can only place tiles on empty game board spaces
    return isEmptySpace(tile.row, tile.column, this.state.gameBoard);
  }

  execute({ tile, sessionId }: this["payload"]) {
    //Add the tile to the board and to the list of tiles
    this.state.gameBoard[
      calculatedIndex(tile.row, tile.column)
    ] = tile.tile.clone();
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
  validate({ tile, sessionId }: this["payload"]) {
    if (this.state.currentTurn !== sessionId) {
      return false;
    }

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
      const idx = calculatedIndex(tile.row, tile.column);
      this.state.gameBoard[idx] = new Tile();

      //Add the removed tile to the players hand
      (this.state.players[sessionId] as Player).hand.push(tile.tile.clone());
    }
  }
}

/** Builds words based on placed tiles. This constructs a trie of all the words. */
export class BuildWordCommand extends Command<WordGameState, {}> {
  validate() {
    if (this.state.placedTiles.length === 0) {
      this.state.currentPlayerAlert = "You must place one or more tiles";
      return false;
    }

    const sortedPlacedTiles = this.state.placedTiles.sort(sortPlacedTiles);
    const isHorizontalContiguous = sortedPlacedTiles.every(
      (tile, idx, placedTiles) => {
        return (
          idx === 0 ||
          (tile.row === placedTiles[idx - 1].row &&
            Math.abs(tile.column - placedTiles[idx - 1].column) === 1)
        );
      }
    );
    const isVerticalContiguous = sortedPlacedTiles.every(
      (tile, idx, placedTiles) => {
        return (
          idx === 0 ||
          (tile.column === placedTiles[idx - 1].column &&
            Math.abs(tile.row - placedTiles[idx - 1].row) === 1)
        );
      }
    );

    if (this.state.turn === 1) {
      //If it's the first turn, we don't care about intesections. We only care that it's a contiguous horizonal or vertical word that at some point goes through the middle square
      const midwayPoint = Math.floor(BOARD_SIZE / 2);
      const validPlacement = this.state.placedTiles.some((tile) => {
        return tile.row === midwayPoint && tile.column === midwayPoint;
      });
      if (!validPlacement) {
        this.state.currentPlayerAlert =
          "On the first turn, the word must go through the center space";
        return false;
      }
      if (!(isVerticalContiguous || isHorizontalContiguous)) {
        this.state.currentPlayerAlert =
          "The placed word must be horizontal or vertical";
        return false;
      }
      return true;
    } else {
      //If it's not the first turn, we also need to make sure this word intersects with another word at some point
      const coordinates = this.state.placedTiles.map((placedTile) =>
        toPlacedTileString(placedTile.row, placedTile.column)
      );
      const placedTileCoordinates = new Set([...coordinates]);
      const hasIntersections = this.state.placedTiles.some((placedTile) => {
        // Check to the left, above, to the right, and below. Check the space
        // is not empty as well as that the space is not a user placed tile
        const toCheck: Array<[number, number]> = [
          [placedTile.row - 1, placedTile.column],
          [placedTile.row, placedTile.column - 1],
          [placedTile.row + 1, placedTile.column],
          [placedTile.row, placedTile.column + 1],
        ];
        return toCheck
          .filter(
            (coords) =>
              !placedTileCoordinates.has(
                toPlacedTileString(coords[0], coords[1])
              )
          )
          .some(
            (coords) =>
              !isEmptySpace(coords[0], coords[1], this.state.gameBoard)
          );
      });

      if (!hasIntersections) {
        this.state.currentPlayerAlert =
          "The placed word must intersect other words";
        return false;
      }

      if (!(isVerticalContiguous || isHorizontalContiguous)) {
        this.state.currentPlayerAlert =
          "The placed word must be horizontal or vertical";
        return false;
      }
      return true;
    }
  }

  execute() {
    const words: Array<Tile[]> = [];
    const visited = new Set<string>();

    if ((this.state.turn = 1)) {
      // Make a word from the placed tiles only if it's the first turn
      const word: Tile[] = [];
      for (let placedTile of this.state.placedTiles) {
        word.push(placedTile.tile);
      }
      words.push(word);

      return [new AddToPlayerScore().setPayload({ words })];
    }

    //Build words for each of the placed tiles by looking veritcally and horizontally
    for (let placedTile of this.state.placedTiles) {
      //Check for vertical words first by going up from the word, then down
      let rowCursor = placedTile.row;
      while (
        !visited.has(toPlacedTileString(rowCursor - 1, placedTile.column)) &&
        !isEmptySpace(rowCursor - 1, placedTile.column, this.state.gameBoard)
      ) {
        rowCursor--;
        visited.add(toPlacedTileString(rowCursor, placedTile.column));
      }
      const verticalStart = rowCursor;

      rowCursor = placedTile.row;
      while (
        !visited.has(toPlacedTileString(rowCursor + 1, placedTile.column)) &&
        !isEmptySpace(rowCursor + 1, placedTile.column, this.state.gameBoard)
      ) {
        rowCursor++;
        visited.add(toPlacedTileString(rowCursor, placedTile.column));
      }
      const verticalEnd = rowCursor;

      if (verticalEnd !== verticalStart) {
        const verticalWord: Tile[] = [];
        for (let row = verticalStart; row <= verticalEnd; row++) {
          verticalWord.push(
            this.state.gameBoard[calculatedIndex(row, placedTile.column)]
          );
        }
        words.push(verticalWord);
      }

      //Now check for a horizontal word
      //Check for vertical words first by going up from the word, then down
      let columnCursor = placedTile.column;
      while (
        !visited.has(toPlacedTileString(placedTile.row, columnCursor - 1)) &&
        !isEmptySpace(placedTile.row, columnCursor - 1, this.state.gameBoard)
      ) {
        columnCursor--;
        visited.add(toPlacedTileString(placedTile.row, columnCursor));
      }
      const horizontalStart = columnCursor;

      columnCursor = placedTile.column;
      while (
        !visited.has(toPlacedTileString(placedTile.row, columnCursor + 1)) &&
        !isEmptySpace(placedTile.row, columnCursor + 1, this.state.gameBoard)
      ) {
        columnCursor++;
        visited.add(toPlacedTileString(placedTile.row, columnCursor));
      }
      const horizontalEnd = columnCursor;
      if (horizontalEnd !== horizontalStart) {
        const horizonalWord: Tile[] = [];
        for (let column = horizontalStart; column <= horizontalEnd; column++) {
          horizonalWord.push(
            this.state.gameBoard[calculatedIndex(placedTile.row, column)]
          );
        }
        words.push(horizonalWord);
      }

      //Add the coordinatese to the visited list
      visited.add(toPlacedTileString(placedTile.row, placedTile.column));
    }

    // Set off the scoring and next turn flow
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
      new DrawTilesCommand().setPayload({ sessionId: this.state.currentTurn }),
      new CheckForGameOverComand(),
      new NextPlayerCommand(),
      new ResetPlacedTilesCommand(),
    ];
  }
}

/** Checks if it's game over, if it is does the final scoring and state changes */
export class CheckForGameOverComand extends Command<WordGameState, {}> {
  execute() {
    //TODO: change the game over logic to do one final turn, then add to the score
    if (this.state.tileDeck.length === 0) {
      this.state.gameOver = true;
    }
  }
}

/** Resets the placed tiles at the end of a turn */
export class ResetPlacedTilesCommand extends Command<WordGameState, {}> {
  execute() {
    this.state.placedTiles.splice(0, this.state.placedTiles.length);
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

/**
 * Helper function to transform coordingates into a string of the form 'row,column' so we can store is in a set.
 * This will allow for easy lookup of a placed tile coorinate when we do word building calculations
 */
function toPlacedTileString(row: number, column: number): string {
  return `${row},${column}`;
}
