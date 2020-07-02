//
// THIS FILE HAS BEEN GENERATED AUTOMATICALLY
// DO NOT CHANGE IT MANUALLY UNLESS YOU KNOW WHAT YOU'RE DOING
//
// GENERATED USING @colyseus/schema 0.5.39
//

import {
  Schema,
  type,
  ArraySchema,
  MapSchema,
  DataChange
} from "@colyseus/schema";
import { Player } from "./Player";
import { Tile } from "./Tile";
import { PlacedTile } from "./PlacedTile";

export class WordGameState extends Schema {
  @type({ map: Player }) public players: MapSchema<Player> = new MapSchema<
    Player
  >();
  @type("string") public currentTurn: string;
  @type([Tile]) public tileDeck: ArraySchema<Tile> = new ArraySchema<Tile>();
  @type([Tile]) public gameBoard: ArraySchema<Tile> = new ArraySchema<Tile>();
  @type([PlacedTile]) public placedTiles: ArraySchema<
    PlacedTile
  > = new ArraySchema<PlacedTile>();
  @type("boolean") public gameOver: boolean;
}
