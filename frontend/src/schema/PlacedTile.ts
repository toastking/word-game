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
import { Tile } from "./Tile";

export class PlacedTile extends Schema {
  @type("number") public row: number;
  @type("number") public column: number;
  @type(Tile) public tile: Tile = new Tile();
}
