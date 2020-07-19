import { Dispatcher } from "@colyseus/command";
import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { Client, Room } from "colyseus";
import {
  BuildWordCommand,
  OnCreateCommand,
  OnGameStartCommand,
  PlaceTileCommand,
  RemoveTileCommand,
} from "./GameCommands";
import { OnJoinCommand, OnLeaveCommand } from "./PlayerCommands";

/** Repressents a game tile */
export class Tile extends Schema {
  @type("string")
  letter: string;
  @type("number")
  points: number = -1;
  constructor(letter?: string, points?: number) {
    super();
    if (letter) {
      this.letter = letter;
    }
    if (points) {
      this.points = points;
    }
  }
}

/** Represents a tile played by a player on the board */
export class PlacedTile extends Schema {
  @type("number")
  row: number;
  @type("number")
  column: number;
  @type(Tile)
  tile: Tile;

  constructor(row: number, column: number, tile: Tile) {
    super();

    this.row = row;
    this.column = column;
    this.tile = tile;
  }
}

export class Player extends Schema {
  @type("string")
  name: string = "";
  @type("number")
  score: number = 0;
  // The list of tiles the player can play
  @type([Tile])
  hand = new ArraySchema<Tile>();

  constructor(name?: string) {
    super();
    this.name = name;
  }
}

export class WordGameState extends Schema {
  @type({ map: Player })
  players = new MapSchema<Player>();

  /** Id of the current player who's turn is it */
  @type("string")
  currentTurn: string;

  /**  List of tiles that can be drawn into players hands */
  @type([Tile])
  tileDeck = new ArraySchema<Tile>();

  /** 1d array that represnts the 2d game board */
  @type([Tile])
  gameBoard = new ArraySchema<Tile>();

  /** Tiles placed by a player */
  @type([PlacedTile])
  placedTiles = new ArraySchema<PlacedTile>();

  @type("boolean")
  gameOver = false;

  @type("boolean")
  gameStarted = false;

  @type("number")
  turn = 1;
}

export class GameRoom extends Room<WordGameState> {
  readonly dispatcher = new Dispatcher(this);

  onCreate(options: any) {
    this.maxClients = 4;
    //Set the intial State
    this.setState(new WordGameState());

    //Initialize the board and deck
    this.dispatcher.dispatch(new OnCreateCommand());

    this.onMessage("startGame", () => {
      this.dispatcher.dispatch(new OnGameStartCommand());
    });

    this.onMessage(
      "placeTile",
      (
        client,
        message: { row: number; column: number; letter: string; points: number }
      ) => {
        const tile = new Tile(message.letter, message.points);
        const placedTile = new PlacedTile(message.row, message.column, tile);
        this.dispatcher.dispatch(new PlaceTileCommand(), {
          tile: placedTile,
          sessionId: client.sessionId,
        });
      }
    );

    this.onMessage(
      "removeTile",
      (
        client,
        message: { row: number; column: number; letter: string; points: number }
      ) => {
        const tile = new Tile(message.letter, message.points);
        const placedTile = new PlacedTile(message.row, message.column, tile);
        this.dispatcher.dispatch(new RemoveTileCommand(), {
          tile: placedTile,
          sessionId: client.sessionId,
        });
      }
    );

    this.onMessage("playWord", () => {
      this.dispatcher.dispatch(new BuildWordCommand());
    });
  }

  onJoin(client: Client, options: any) {
    console.log("joined");
    console.log(options?.playerName);

    this.dispatcher.dispatch(new OnJoinCommand(), {
      sessionId: client.sessionId,
      name: options?.playerName,
    });
  }

  onLeave(client: Client, consented: boolean) {
    this.dispatcher.dispatch(new OnLeaveCommand(), {
      sessionId: client.sessionId,
    });
  }

  onDispose() {
    this.dispatcher.stop();
  }
}
